"""
Compression service — orchestrates running all three compression algorithms
in parallel using concurrent.futures.ThreadPoolExecutor.
"""
import time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

from compressors.nearest_neighbor import NearestNeighborCompressor
from compressors.jpeg_quality import JPEGQualityCompressor
from compressors.svd import SVDCompressor
from services.file_service import save_compressed, get_file_size
from utils.formatters import format_bytes, format_percentage


# Singleton instances
_nn_compressor = NearestNeighborCompressor()
_jpeg_compressor = JPEGQualityCompressor(quality=30)
_svd_compressor = SVDCompressor()


def _run_single_compression(compressor, image, session_id, original_size, **kwargs):
    """
    Run a single compressor: compress, save, measure, and return result dict.
    """
    start = time.perf_counter()
    compressed_image, pure_size = compressor.compress(image, **kwargs)
    
    # Save as PNG
    filepath = save_compressed(session_id, compressor.algorithm_name, compressed_image)
    compressed_size = get_file_size(filepath)

    elapsed_ms = round((time.perf_counter() - start) * 1000)
    extension = "png"

    return {
        "algorithm": compressor.algorithm_name,
        "label": compressor.label,
        "size_bytes": compressed_size,
        "size_human": format_bytes(compressed_size),
        "pure_size_bytes": pure_size,
        "pure_size_human": format_bytes(pure_size),
        "width": compressed_image.size[0],
        "height": compressed_image.size[1],
        "duration_ms": elapsed_ms,
        "url": f"/api/download/{session_id}/{compressor.algorithm_name}.{extension}",
        "params": compressor.get_params_used(**kwargs),
    }


def run_all_compressions(
    image: Image.Image,
    session_id: str,
    original_size_bytes: int,
    scale_factor: float = 0.5,
    jpeg_quality: int = 30,
    svd_rank: int = 50,
) -> list[dict]:
    """
    Run all three compression algorithms in parallel.
    
    Args:
        image: PIL Image in RGB mode.
        session_id: Session ID for file storage.
        original_size_bytes: Size of the original file for reduction calculation.
        scale_factor: Parameter for Nearest-Neighbor.
        svd_rank: Parameter for SVD.
        
    Returns:
        List of result dicts, one per algorithm.
    """
    # Ensure image is RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    tasks = [
        (_nn_compressor, {"scale_factor": scale_factor}),
        (_jpeg_compressor, {"quality": jpeg_quality}),
        (_svd_compressor, {"rank": svd_rank}),
    ]

    results = []

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = []
        for compressor, kwargs in tasks:
            future = executor.submit(
                _run_single_compression,
                compressor,
                image.copy(),  # Each thread gets its own copy
                session_id,
                original_size_bytes,
                **kwargs,
            )
            futures.append(future)

        for future in futures:
            result = future.result()
            # Add reduction percentages
            result["reduction_percent"] = format_percentage(
                original_size_bytes, result["size_bytes"]
            )
            result["pure_reduction_percent"] = format_percentage(
                original_size_bytes, result["pure_size_bytes"]
            )
            results.append(result)

    return results
