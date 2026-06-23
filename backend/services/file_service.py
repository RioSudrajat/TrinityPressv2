"""
File service — handles saving images to temp directories, size calculations,
cleanup of expired sessions, and ZIP archive generation.
"""
import os
import io
import uuid
import time
import shutil
import zipfile
import threading
from PIL import Image

from config import UPLOAD_FOLDER, SESSION_MAX_AGE, SESSION_CLEANUP_INTERVAL


# In-memory session registry: session_id -> {"path": str, "created_at": float}
_sessions: dict[str, dict] = {}
_sessions_lock = threading.Lock()


def create_session() -> str:
    """Create a new session with a unique ID and temp directory."""
    session_id = str(uuid.uuid4())
    session_path = os.path.join(UPLOAD_FOLDER, session_id)
    os.makedirs(session_path, exist_ok=True)

    with _sessions_lock:
        _sessions[session_id] = {
            "path": session_path,
            "created_at": time.time(),
        }

    return session_id


def get_session_path(session_id: str) -> str | None:
    """Get the filesystem path for a session, or None if it doesn't exist."""
    with _sessions_lock:
        session = _sessions.get(session_id)
        if session and os.path.isdir(session["path"]):
            return session["path"]
    return None


def save_original(session_id: str, file_data: bytes, original_filename: str) -> str:
    """
    Save the original raw file data with its original extension in the session directory.
    Returns the filesystem path of the saved file.
    """
    session_path = get_session_path(session_id)
    if not session_path:
        raise ValueError(f"Session {session_id} not found")

    _, ext = os.path.splitext(original_filename)
    if not ext:
        ext = ".png"

    filepath = os.path.join(session_path, f"original{ext.lower()}")
    with open(filepath, "wb") as f:
        f.write(file_data)
    return filepath


def save_compressed(
    session_id: str,
    algorithm_name: str,
    image: Image.Image
) -> str:

    session_path = get_session_path(session_id)

    if not session_path:
        raise ValueError(f"Session {session_id} not found")

    filepath = os.path.join(
        session_path,
        f"{algorithm_name}.png"
    )

    image.save(filepath, "PNG")

    return filepath


def get_file_path(session_id: str, filename: str) -> str | None:
    """Get the full path for a file in a session directory."""
    session_path = get_session_path(session_id)
    if not session_path:
        return None

    filepath = os.path.join(session_path, filename)
    if os.path.isfile(filepath):
        return filepath
    return None


def get_file_size(filepath: str) -> int:
    """Get file size in bytes."""
    return os.path.getsize(filepath)


def create_zip(session_id: str, original_filename: str) -> io.BytesIO:
    """
    Create a ZIP archive containing all compressed files in the session.
    Returns a BytesIO buffer containing the ZIP.
    """
    session_path = get_session_path(session_id)
    if not session_path:
        raise ValueError(f"Session {session_id} not found")

    name_base = os.path.splitext(original_filename)[0]
    allowed_algo_files = ["nearest_neighbor.png", "jpeg_quality.png", "svd.png"]

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename in allowed_algo_files:
            filepath = os.path.join(session_path, filename)
            if os.path.isfile(filepath):
                name_part, ext = os.path.splitext(filename)
                archive_name = f"{name_base}_{name_part}{ext}"
                zf.write(filepath, archive_name)

    zip_buffer.seek(0)
    return zip_buffer


def cleanup_expired_sessions():
    """Remove sessions older than SESSION_MAX_AGE."""
    now = time.time()
    expired = []

    with _sessions_lock:
        for sid, info in _sessions.items():
            if now - info["created_at"] > SESSION_MAX_AGE:
                expired.append(sid)

        for sid in expired:
            info = _sessions.pop(sid, None)
            if info and os.path.isdir(info["path"]):
                try:
                    shutil.rmtree(info["path"])
                except OSError:
                    pass  # Best-effort cleanup


def start_cleanup_scheduler():
    """Start a background thread that periodically cleans up expired sessions."""
    def _run():
        while True:
            time.sleep(SESSION_CLEANUP_INTERVAL)
            cleanup_expired_sessions()

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()
