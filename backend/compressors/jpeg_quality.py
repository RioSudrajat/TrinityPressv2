from PIL import Image
import io


class JPEGQualityCompressor:

    algorithm_name = "jpeg_quality"
    label = "JPEG Quality (Q=30)"

    def __init__(self, quality=30):
        self.quality = quality

    def compress(self, image, **kwargs):

        buffer = io.BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=self.quality,
            optimize=True
        )

        buffer.seek(0)

        compressed = Image.open(buffer).convert("RGB")

        return compressed

    def get_params_used(self, **kwargs):
        return {
            "quality": self.quality
        }