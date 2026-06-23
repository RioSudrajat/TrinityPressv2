"""
SVD (Singular Value Decomposition) Compression.

Treats each color channel (R, G, B) as a matrix, performs SVD factorization,
and reconstructs using only the top-k singular values (low-rank approximation).
Lower rank = more compression but more visual blur.
"""
import numpy as np
from PIL import Image
from .base import BaseCompressor


class SVDCompressor(BaseCompressor):

    @property
    def algorithm_name(self) -> str:
        return "svd"

    @property
    def label(self) -> str:
        return "SVD Decomposition"

    def compress(self, image: Image.Image, **kwargs) -> tuple[Image.Image, int]:
        rank: int = kwargs.get("rank", 50)

        # Clamp to valid range
        rank = max(1, min(200, rank))

        img_array = np.array(image, dtype=np.float64)
        channels = []

        for i in range(3):  # R, G, B
            channel = img_array[:, :, i]
            U, S, Vt = np.linalg.svd(channel, full_matrices=False)

            # Low-rank approximation
            k = min(rank, len(S))
            compressed = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
            compressed = np.clip(compressed, 0, 255)
            channels.append(compressed)

        result_array = np.stack(channels, axis=2).astype(np.uint8)
        reconstructed = Image.fromarray(result_array)

        # Calculate pure size (decomposed matrix factors size: 3 channels * rank * (H + W + 1))
        h, w = image.size[1], image.size[0]
        pure_size = 3 * rank * (h + w + 1)

        return reconstructed, pure_size

    def get_params_used(self, **kwargs) -> dict:
        rank = kwargs.get("rank", 50)
        rank = max(1, min(200, rank))
        return {"rank": rank}
