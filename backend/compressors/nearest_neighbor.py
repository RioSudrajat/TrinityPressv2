"""
Nearest-Neighbor Resampling Compression.

Downscales the image using nearest-neighbor interpolation (no anti-aliasing),
then upscales back to the original dimensions. This produces a pixelated
effect and reduces PNG file size because large uniform-color blocks compress
efficiently under deflate.
"""
from PIL import Image
from .base import BaseCompressor


class NearestNeighborCompressor(BaseCompressor):

    @property
    def algorithm_name(self) -> str:
        return "nearest_neighbor"

    @property
    def label(self) -> str:
        return "Nearest-Neighbor Resampling"

    def compress(self, image: Image.Image, **kwargs) -> tuple[Image.Image, int]:
        scale_factor: float = kwargs.get("scale_factor", 0.5)

        # Clamp to valid range
        scale_factor = max(0.1, min(0.9, scale_factor))

        original_size = image.size  # (width, height)

        # Downscale with nearest-neighbor
        small_w = max(1, int(original_size[0] * scale_factor))
        small_h = max(1, int(original_size[1] * scale_factor))
        downscaled = image.resize((small_w, small_h), Image.NEAREST)

        # Pure size is the size of the downscaled image (as PNG)
        import io
        buf = io.BytesIO()
        downscaled.save(buf, "PNG")
        pure_size = len(buf.getvalue())

        # Upscale back to original resolution
        upscaled = downscaled.resize(original_size, Image.NEAREST)

        return upscaled, pure_size

    def get_params_used(self, **kwargs) -> dict:
        scale_factor = kwargs.get("scale_factor", 0.5)
        scale_factor = max(0.1, min(0.9, scale_factor))
        return {"scale_factor": scale_factor}
