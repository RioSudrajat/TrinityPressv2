"""
Server-side file validation using magic bytes.
"""

# Magic byte signatures for supported image formats
MAGIC_BYTES = {
    "png": [b"\x89PNG\r\n\x1a\n"],
    "jpeg": [b"\xff\xd8\xff"],
    "webp": [b"RIFF"],  # RIFF header, actual WEBP check needs offset 8-11
    "bmp": [b"BM"],
}


def detect_file_type(file_data: bytes) -> str | None:
    """
    Detect the image file type by inspecting magic bytes.
    
    Args:
        file_data: Raw file bytes (at least the first 12 bytes).
        
    Returns:
        Detected type string ('png', 'jpeg', 'webp', 'bmp') or None if unknown.
    """
    if len(file_data) < 4:
        return None

    # PNG: 89 50 4E 47 0D 0A 1A 0A
    if file_data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"

    # JPEG: FF D8 FF
    if file_data[:3] == b"\xff\xd8\xff":
        return "jpeg"

    # WEBP: RIFF....WEBP
    if len(file_data) >= 12 and file_data[:4] == b"RIFF" and file_data[8:12] == b"WEBP":
        return "webp"

    # BMP: BM
    if file_data[:2] == b"BM":
        return "bmp"

    return None


def validate_file_type(file_data: bytes) -> tuple[bool, str | None]:
    """
    Validate that the file is a supported image format.
    
    Returns:
        Tuple of (is_valid, error_message_or_None).
    """
    detected = detect_file_type(file_data)
    if detected is None:
        return False, "Format file tidak didukung. Gunakan PNG, JPEG, WEBP, atau BMP."
    return True, None


def validate_file_size(file_size: int, max_size: int) -> tuple[bool, str | None]:
    """
    Validate that the file is within the size limit.
    
    Returns:
        Tuple of (is_valid, error_message_or_None).
    """
    if file_size > max_size:
        return False, f"Ukuran file melebihi batas {max_size // (1024 * 1024)} MB."
    return True, None
