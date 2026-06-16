/**
 * Formats bytes to a human-readable string (e.g. 10.2 MB, 842 KB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "0 B";
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formats reduction percentage
 * @param {number} percent 
 * @returns {string}
 */
export function formatPercentage(percent) {
  if (percent === undefined || percent === null || isNaN(percent)) return "0%";
  const sign = percent > 0 ? "↓ " : percent < 0 ? "↑ " : "";
  return `${sign}${Math.abs(percent).toFixed(1)}%`;
}

/**
 * Formats duration in milliseconds or seconds
 * @param {number} ms 
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms === undefined || ms === null || isNaN(ms)) return "0s";
  if (ms < 1000) {
    return `${ms} ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}
