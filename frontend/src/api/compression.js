import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s timeout for processing SVD on larger images
});

/**
 * Checks if the backend server is active and healthy
 * @returns {Promise<{ status: string, version: string }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error("Backend health check failed:", error);
    throw new Error("Server tidak tersedia. Silakan periksa koneksi backend Flask Anda.");
  }
}

/**
 * Uploads an image and triggers compression using the 3 algorithms.
 * @param {File} file - The image file
 * @param {number} scaleFactor - Nearest Neighbor scale factor (0.1 - 0.9)
 * @param {number} svdRank - SVD Rank (1 - 200)
 * @param {function} onUploadProgress - Callback for upload progress tracking
 * @returns {Promise<any>}
 */
export async function compressImage(file, scaleFactor = 0.5, svdRank = 50, onUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scale_factor", scaleFactor);
  formData.append("svd_rank", svdRank);

  try {
    const response = await apiClient.post("/compress", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.error("Image compression API failed:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Gagal memproses kompresi gambar. Silakan coba lagi.");
  }
}

/**
 * Gets the absolute URL for downloading a specific image.
 * @param {string} sessionId 
 * @param {string} filename 
 * @returns {string}
 */
export function getDownloadUrl(sessionId, filename) {
  // If the backend response returned a relative URL, resolve it against the base URL.
  // Otherwise, construct it directly.
  return `${BASE_URL}/download/${sessionId}/${filename}`;
}

/**
 * Gets the absolute URL for downloading all compressed images as a ZIP.
 * @param {string} sessionId 
 * @returns {string}
 */
export function getZipDownloadUrl(sessionId) {
  return `${BASE_URL}/download/${sessionId}/all.zip`;
}
