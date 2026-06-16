"""
TrinityPress Backend Configuration
"""
import os
import tempfile

# File Upload Limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_FILES_PER_BATCH = 10

# Allowed file extensions and MIME types
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}
ALLOWED_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/bmp",
    "image/x-ms-bmp",
}

# Temporary storage
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), "trinitypress")

# Session cleanup interval (seconds)
SESSION_CLEANUP_INTERVAL = 30 * 60  # 30 minutes
SESSION_MAX_AGE = 30 * 60  # 30 minutes

# Compression defaults
DEFAULT_SCALE_FACTOR = 0.5
DEFAULT_SVD_RANK = 50

# Parameter ranges
SCALE_FACTOR_MIN = 0.1
SCALE_FACTOR_MAX = 0.9
SVD_RANK_MIN = 1
SVD_RANK_MAX = 200

# App version
VERSION = "1.0.0"
