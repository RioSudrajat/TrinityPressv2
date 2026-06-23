"""
Abstract base class for all compression algorithms.
"""
from abc import ABC, abstractmethod
from PIL import Image


class BaseCompressor(ABC):
    """Base class that all TrinityPress compressors must implement."""

    @property
    @abstractmethod
    def algorithm_name(self) -> str:
        """Machine-readable algorithm identifier (e.g. 'nearest_neighbor')."""
        pass

    @property
    @abstractmethod
    def label(self) -> str:
        """Human-readable label for display (e.g. 'Nearest-Neighbor Resampling')."""
        pass

    @abstractmethod
    def compress(self, image: Image.Image, **kwargs) -> tuple[Image.Image, int]:
        """
        Compress the given PIL Image and return a tuple of (Compressed PIL Image, pure_size_bytes).
        
        Args:
            image: Input PIL Image in RGB mode.
            **kwargs: Algorithm-specific parameters.
            
        Returns:
            Tuple of (Compressed PIL Image in RGB mode, pure_size_bytes).
        """
        pass

    def get_params_used(self, **kwargs) -> dict:
        """Return a dict of the parameters that were actually used."""
        return {}
