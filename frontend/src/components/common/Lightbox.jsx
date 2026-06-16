import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react";
import { formatBytes, formatPercentage } from "../../utils/formatters";

const API_BASE = "http://localhost:5000";
function resolveUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function Lightbox({
  isOpen,
  onClose,
  original,
  results,
  defaultAlgorithm = "original",
}) {
  if (!isOpen || !original) return null;

  const [activeTab, setActiveTab] = useState(defaultAlgorithm);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = fitting, 2 = zoomed

  // Compile active image details
  let activeImage = resolveUrl(original.url);
  let activeLabel = "Original Image";
  let activeSize = original.size_bytes;
  let activeReduction = 0;
  let tabColor = "border-b-2 border-accentPrimary text-accentPrimary";

  if (activeTab !== "original") {
    const res = results.find((r) => r.algorithm === activeTab);
    if (res) {
      activeImage = resolveUrl(res.url);
      activeLabel = res.label;
      activeSize = res.size_bytes;
      activeReduction = res.reduction_percent;
      
      if (activeTab === "nearest_neighbor") {
        tabColor = "border-b-2 border-accentPrimary text-accentPrimary";
      } else if (activeTab === "chroma_subsampling") {
        tabColor = "border-b-2 border-accentSecondary text-accentSecondary";
      } else if (activeTab === "svd") {
        tabColor = "border-b-2 border-accentTertiary text-accentTertiary";
      }
    }
  }

  const toggleZoom = () => {
    setZoomLevel(prev => prev === 1 ? 2 : 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-background/95 backdrop-blur-md p-4 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderHalus/60 pb-3">
        {/* Title & Metadata */}
        <div>
          <h4 className="font-display font-semibold text-textMain flex items-center gap-2 text-sm md:text-base">
            <Layers size={16} className="text-accentPrimary" />
            Perbandingan Visual — <span className="text-textSec font-normal">{original.filename}</span>
          </h4>
          <p className="text-xs text-textLabel font-mono mt-0.5">
            Aktif: <span className="text-textMain font-semibold">{activeLabel}</span> ·{" "}
            {formatBytes(activeSize)}
            {activeReduction !== 0 && ` (${formatPercentage(activeReduction)})`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={toggleZoom}
            className="p-2 rounded bg-surfaceElevated hover:bg-borderHalus text-textMain border border-borderHalus/60 transition-colors"
            title={zoomLevel === 1 ? "Perbesar 200%" : "Kecilkan ke Ukuran Asli"}
          >
            {zoomLevel === 1 ? <ZoomIn size={16} /> : <ZoomOut size={16} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded bg-error/20 hover:bg-error/30 text-error border border-error/30 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <X size={16} />
            <span>Tutup</span>
          </button>
        </div>
      </div>

      {/* Image Sandbox Area */}
      <div className="flex-grow flex items-center justify-center overflow-auto my-4 relative bg-background/40 border border-borderHalus/30 rounded-xl">
        <div 
          className="transition-transform duration-200 ease-out max-h-full max-w-full flex items-center justify-center p-4"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={activeImage}
            alt={activeLabel}
            className="max-h-[70vh] max-w-full object-contain rounded select-none cursor-move shadow-2xl"
            onDoubleClick={toggleZoom}
          />
        </div>
      </div>

      {/* Bottom Selection Tabs */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface/50 border border-borderHalus/60 max-w-full overflow-x-auto">
          {/* Original Tab */}
          <button
            onClick={() => { setActiveTab("original"); setZoomLevel(1); }}
            className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === "original"
                ? "bg-surfaceElevated text-textMain border border-borderHalus shadow-md"
                : "text-textSec hover:text-textMain hover:bg-surface/30"
            }`}
          >
            Original
          </button>

          {/* NN Tab */}
          {results.some(r => r.algorithm === "nearest_neighbor") && (
            <button
              onClick={() => { setActiveTab("nearest_neighbor"); setZoomLevel(1); }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "nearest_neighbor"
                  ? "bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/40 shadow-md"
                  : "text-textSec hover:text-textMain hover:bg-surface/30"
              }`}
            >
              Nearest Neighbor
            </button>
          )}

          {/* Chroma Tab */}
          {results.some(r => r.algorithm === "chroma_subsampling") && (
            <button
              onClick={() => { setActiveTab("chroma_subsampling"); setZoomLevel(1); }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "chroma_subsampling"
                  ? "bg-accentSecondary/20 text-accentSecondary border border-accentSecondary/40 shadow-md"
                  : "text-textSec hover:text-textMain hover:bg-surface/30"
              }`}
            >
              Chroma Sub
            </button>
          )}

          {/* SVD Tab */}
          {results.some(r => r.algorithm === "svd") && (
            <button
              onClick={() => { setActiveTab("svd"); setZoomLevel(1); }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "svd"
                  ? "bg-accentTertiary/20 text-accentTertiary border border-accentTertiary/40 shadow-md"
                  : "text-textSec hover:text-textMain hover:bg-surface/30"
              }`}
            >
              SVD
            </button>
          )}
        </div>
        
        <p className="text-[10px] text-textSec font-mono">
          Tip: Klik dua kali gambar untuk melakukan zoom cepat. Gunakan tab untuk beralih instan dan melihat perbedaan pixel.
        </p>
      </div>
    </div>
  );
}
