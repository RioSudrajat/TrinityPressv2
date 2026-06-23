from PIL import Image
import io


class JPEGQualityCompressor:

    algorithm_name = "jpeg_quality"
    label = "JPEG Quality (Q=30)"

    def __init__(self, quality=30):
        self.quality = quality

    def compress(self, image, **kwargs):
        quality = kwargs.get("quality", self.quality)
        buffer = io.BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=quality,
            optimize=True
        )

        pure_size = len(buffer.getvalue())
        buffer.seek(0)

        compressed = Image.open(buffer).convert("RGB")

        return compressed, pure_size

    def get_params_used(self, **kwargs):
        quality = kwargs.get("quality", self.quality)
        return {
            "quality": quality
        }