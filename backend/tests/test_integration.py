"""
End-to-end integration test for TrinityPress backend.
Creates a test image, uploads it, and validates the full compress → download flow.
"""
import io
import json
import requests
from PIL import Image

BASE_URL = "http://localhost:5000/api"


def create_test_image(width=200, height=150):
    """Create a colorful test image with gradients."""
    import numpy as np
    arr = np.zeros((height, width, 3), dtype=np.uint8)
    for y in range(height):
        for x in range(width):
            arr[y, x, 0] = int(255 * x / width)       # R gradient
            arr[y, x, 1] = int(255 * y / height)       # G gradient
            arr[y, x, 2] = min(255, 128 + 40 * ((x + y) % 3))  # B pattern
    return Image.fromarray(arr)


def test_health():
    print("=== Test: Health Check ===")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    assert data["status"] == "ok"
    assert "version" in data
    print(f"  ✓ Health OK: {data}")


def test_compress():
    print("\n=== Test: Compress Image ===")
    
    # Create test image
    img = create_test_image(300, 200)
    buf = io.BytesIO()
    img.save(buf, "PNG")
    buf.seek(0)
    
    # Upload
    files = {"file": ("test_gradient.png", buf, "image/png")}
    data = {"scale_factor": "0.5", "svd_rank": "30"}
    
    r = requests.post(f"{BASE_URL}/compress", files=files, data=data)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    
    result = r.json()
    
    # Validate response structure
    assert "session_id" in result, "Missing session_id"
    assert "original" in result, "Missing original"
    assert "results" in result, "Missing results"
    assert len(result["results"]) == 3, f"Expected 3 results, got {len(result['results'])}"
    
    session_id = result["session_id"]
    orig = result["original"]
    
    print(f"  Session: {session_id}")
    print(f"  Original: {orig['filename']} — {orig['size_human']} ({orig['width']}×{orig['height']})")
    
    # Validate each algorithm result
    expected_algos = {"nearest_neighbor", "chroma_subsampling", "svd"}
    found_algos = set()
    
    for res in result["results"]:
        algo = res["algorithm"]
        found_algos.add(algo)
        assert "label" in res
        assert "size_bytes" in res
        assert "size_human" in res
        assert "width" in res
        assert "height" in res
        assert "reduction_percent" in res
        assert "duration_ms" in res
        assert "url" in res
        assert "params" in res
        
        print(f"  {res['label']}: {res['size_human']} (↓{res['reduction_percent']}%) — {res['duration_ms']}ms")
    
    assert found_algos == expected_algos, f"Missing algorithms: {expected_algos - found_algos}"
    print("  ✓ All 3 algorithms returned valid results")
    
    return result


def test_download(result):
    print("\n=== Test: Download Files ===")
    session_id = result["session_id"]
    
    # Download original
    orig_url = f"http://localhost:5000{result['original']['url']}"
    r = requests.get(orig_url)
    assert r.status_code == 200, f"Original download failed: {r.status_code}"
    assert r.headers["Content-Type"] == "image/png"
    # Verify it's a valid PNG
    img = Image.open(io.BytesIO(r.content))
    assert img.format == "PNG"
    print(f"  ✓ Original downloaded: {len(r.content)} bytes, {img.size}")
    
    # Download each compressed image
    for res in result["results"]:
        url = f"http://localhost:5000{res['url']}"
        r = requests.get(url)
        assert r.status_code == 200, f"{res['algorithm']} download failed: {r.status_code}"
        img = Image.open(io.BytesIO(r.content))
        assert img.format == "PNG"
        print(f"  ✓ {res['algorithm']}: {len(r.content)} bytes, {img.size}")
    
    # Download ZIP
    zip_url = f"http://localhost:5000/api/download/{session_id}/all.zip"
    r = requests.get(zip_url)
    assert r.status_code == 200, f"ZIP download failed: {r.status_code}"
    assert "zip" in r.headers["Content-Type"].lower() or len(r.content) > 100
    print(f"  ✓ ZIP downloaded: {len(r.content)} bytes")


def test_validation_errors():
    print("\n=== Test: Validation Errors ===")
    
    # Test: No file
    r = requests.post(f"{BASE_URL}/compress")
    assert r.status_code == 400
    print(f"  ✓ No file → 400: {r.json()['message']}")
    
    # Test: Invalid file type
    files = {"file": ("test.txt", b"This is not an image", "text/plain")}
    r = requests.post(f"{BASE_URL}/compress", files=files)
    assert r.status_code == 400
    print(f"  ✓ Invalid type → 400: {r.json()['message']}")


if __name__ == "__main__":
    print("=" * 60)
    print("  TrinityPress Integration Tests")
    print("=" * 60)
    
    test_health()
    result = test_compress()
    test_download(result)
    test_validation_errors()
    
    print("\n" + "=" * 60)
    print("  ALL TESTS PASSED ✓")
    print("=" * 60)
