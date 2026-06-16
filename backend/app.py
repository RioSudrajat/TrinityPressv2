"""
TrinityPress — Flask Backend Application

Routes:
    GET  /api/health                          → Health check
    POST /api/compress                        → Upload & compress image
    GET  /api/download/<session_id>/<filename> → Download single file
    GET  /api/download/<session_id>/all.zip    → Download all as ZIP
"""
import os
import io
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image

from config import (
    MAX_FILE_SIZE,
    DEFAULT_SCALE_FACTOR,
    DEFAULT_SVD_RANK,
    SCALE_FACTOR_MIN,
    SCALE_FACTOR_MAX,
    SVD_RANK_MIN,
    SVD_RANK_MAX,
    UPLOAD_FOLDER,
    VERSION,
)
from utils.validators import validate_file_type, validate_file_size
from utils.formatters import format_bytes
from services.file_service import (
    create_session,
    save_original,
    get_file_path,
    get_file_size,
    create_zip,
    start_cleanup_scheduler,
)
from services.compression_service import run_all_compressions


def create_app() -> Flask:
    """Application factory."""
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE + 1024  # Small margin for form fields

    # Enable CORS for the React frontend dev server
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Start background cleanup thread
    start_cleanup_scheduler()

    # ─── Routes ───────────────────────────────────────────────────────────────

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Health check endpoint."""
        return jsonify({"status": "ok", "version": VERSION})

    @app.route("/api/compress", methods=["POST"])
    def compress_image():
        """
        Upload and compress a single image with all three algorithms.
        
        Expects multipart/form-data with:
            file:          image file
            scale_factor:  float (0.1-0.9, optional, default 0.5)
            svd_rank:      int   (1-200,   optional, default 50)
        """
        # --- Validate file presence ---
        if "file" not in request.files:
            return jsonify({
                "error": "no_file",
                "message": "Tidak ada file yang diunggah.",
            }), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({
                "error": "empty_filename",
                "message": "Nama file kosong.",
            }), 400

        # --- Read file data ---
        file_data = file.read()
        file_size = len(file_data)

        # --- Validate file size ---
        is_valid_size, size_error = validate_file_size(file_size, MAX_FILE_SIZE)
        if not is_valid_size:
            return jsonify({
                "error": "file_too_large",
                "message": size_error,
            }), 413

        # --- Validate file type via magic bytes ---
        is_valid_type, type_error = validate_file_type(file_data)
        if not is_valid_type:
            return jsonify({
                "error": "invalid_file_type",
                "message": type_error,
            }), 400

        # --- Parse parameters ---
        try:
            scale_factor = float(request.form.get("scale_factor", DEFAULT_SCALE_FACTOR))
            scale_factor = max(SCALE_FACTOR_MIN, min(SCALE_FACTOR_MAX, scale_factor))
        except (ValueError, TypeError):
            scale_factor = DEFAULT_SCALE_FACTOR

        try:
            svd_rank = int(request.form.get("svd_rank", DEFAULT_SVD_RANK))
            svd_rank = max(SVD_RANK_MIN, min(SVD_RANK_MAX, svd_rank))
        except (ValueError, TypeError):
            svd_rank = DEFAULT_SVD_RANK

        # --- Open image ---
        try:
            image = Image.open(io.BytesIO(file_data))
            image = image.convert("RGB")
        except Exception:
            return jsonify({
                "error": "invalid_image",
                "message": "File tidak dapat dibaca sebagai gambar — coba file lain.",
            }), 400

        # --- Create session and save original ---
        session_id = create_session()
        original_filename = file.filename or "image.png"

        original_path = save_original(session_id, image, original_filename)
        original_size = file_size

        # --- Run all compressions in parallel ---
        try:
            results = run_all_compressions(
                image=image,
                session_id=session_id,
                original_size_bytes=original_size,
                scale_factor=scale_factor,
                svd_rank=svd_rank,
            )
        except Exception as e:
            return jsonify({
                "error": "compression_failed",
                "message": f"Gagal memproses kompresi: {str(e)}",
            }), 500

        # --- Update SVD label to include rank ---
        for r in results:
            if r["algorithm"] == "svd":
                r["label"] = f"SVD (rank={svd_rank})"

        # --- Build response ---
        response = {
            "session_id": session_id,
            "original": {
                "filename": original_filename,
                "size_bytes": original_size,
                "size_human": format_bytes(original_size),
                "width": image.size[0],
                "height": image.size[1],
                "url": f"/api/download/{session_id}/original.png",
            },
            "results": results,
        }

        return jsonify(response), 200

    @app.route("/api/download/<session_id>/<filename>", methods=["GET"])
    def download_file(session_id, filename):
        """Serve a file from a session directory."""
        # Handle ZIP download
        if filename == "all.zip":
            return download_all_zip(session_id)

        filepath = get_file_path(session_id, filename)
        if filepath is None:
            return jsonify({
                "error": "not_found",
                "message": "Session atau file tidak ditemukan.",
            }), 404

        return send_file(
            filepath,
            mimetype="image/png",
            as_attachment=True,
            download_name=filename,
        )

    def download_all_zip(session_id):
        """Generate and serve a ZIP of all compressed files."""
        try:
            # Try to get the original filename from the session
            original_path = get_file_path(session_id, "original.png")
            if original_path is None:
                return jsonify({
                    "error": "not_found",
                    "message": "Session tidak ditemukan.",
                }), 404

            zip_buffer = create_zip(session_id, "compressed")
            return send_file(
                zip_buffer,
                mimetype="application/zip",
                as_attachment=True,
                download_name=f"trinitypress_{session_id[:8]}.zip",
            )
        except ValueError:
            return jsonify({
                "error": "not_found",
                "message": "Session tidak ditemukan.",
            }), 404

    # ─── Error Handlers ───────────────────────────────────────────────────────

    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({
            "error": "file_too_large",
            "message": "Ukuran file melebihi batas 10 MB.",
        }), 413

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "error": "server_error",
            "message": "Terjadi kesalahan internal pada server.",
        }), 500

    return app


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app = create_app()
    print("=" * 60)
    print("  TrinityPress Backend v" + VERSION)
    print("  Running on http://localhost:5000")
    print("  CORS enabled for http://localhost:5173")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
