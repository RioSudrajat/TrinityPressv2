"""
Formatting utilities for human-readable output.
"""


def format_bytes(size_bytes: int) -> str:
    """Convert bytes to a human-readable string (e.g. '3.2 MB', '842 KB')."""
    if size_bytes == 0:
        return "0 B"

    units = ["B", "KB", "MB", "GB"]
    size = float(size_bytes)

    for unit in units:
        if abs(size) < 1024.0:
            if unit == "B":
                return f"{int(size)} {unit}"
            return f"{size:.1f} {unit}"
        size /= 1024.0

    return f"{size:.1f} TB"


def format_percentage(original: int, compressed: int) -> float:
    """
    Calculate reduction percentage.
    Positive = file got smaller, negative = file got bigger.
    """
    if original == 0:
        return 0.0
    return round(((original - compressed) / original) * 100, 2)
