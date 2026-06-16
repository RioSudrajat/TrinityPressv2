const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/bmp",
  "image/x-ms-bmp", // Alternate BMP mime
];

const ALLOWED_EXTENSIONS = [
  "png", "jpg", "jpeg", "webp", "bmp"
];

/**
 * Validates a file's type and size.
 * Returns an object with { valid: boolean, error: string | null }
 * @param {File} file 
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "Tidak ada file yang diunggah." };
  }

  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File "${file.name}" terlalu besar. Maksimum ukuran adalah 10 MB.` 
    };
  }

  // Check type (mime-type)
  let isTypeAllowed = ALLOWED_TYPES.includes(file.type);

  // Fallback to extension check if mime-type is empty/unknown
  if (!file.type || !isTypeAllowed) {
    const ext = file.name.split(".").pop().toLowerCase();
    isTypeAllowed = ALLOWED_EXTENSIONS.includes(ext);
  }

  if (!isTypeAllowed) {
    return { 
      valid: false, 
      error: `Format file "${file.name}" tidak didukung. Gunakan PNG, JPEG, WEBP, atau BMP.` 
    };
  }

  return { valid: true, error: null };
}
