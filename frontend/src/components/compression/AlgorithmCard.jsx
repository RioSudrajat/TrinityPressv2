import React from "react";
import { Download, Eye, Clock, ShieldCheck } from "lucide-react";
import { formatBytes, formatPercentage, formatDuration } from "../../utils/formatters";

export default function AlgorithmCard({
  algorithm,
  label,
  size,
  pureSize,
  width,
  height,
  reductionPercent,
  pureReductionPercent,
  durationMs,
  imageUrl,
  onZoom,
  onDownload,
}) {
  // Determine algorithm styling variables
  let accentColor = "accent-strip-nn shadow-md";
  let badgeColor = "bg-accentPrimary/20 text-accentPrimary border-accentPrimary/30";
  let glowClass = "nn-glow";

  if (algorithm === "jpeg_quality") {
    accentColor = "accent-strip-jpeg shadow-md";
    badgeColor = "bg-accentSecondary/20 text-accentSecondary border-accentSecondary/30";
    glowClass = "jpeg-glow";
  } else if (algorithm === "svd") {
    accentColor = "accent-strip-svd shadow-md";
    badgeColor = "bg-accentTertiary/20 text-accentTertiary border-accentTertiary/30";
    glowClass = "svd-glow";
  }

  return (
    <div 
      className={`glass-panel rounded-xl overflow-hidden bg-surface/40 hover:bg-surface/60 border border-borderHalus hover:border-textSec/50 transition-all duration-300 group flex cursor-pointer relative ${glowClass} ${accentColor}`}
      onClick={onZoom}
    >
      {/* Content */}
      <div className="flex flex-col flex-grow w-full">
        {/* Header */}
        <div className="px-4 py-3 bg-surface/80 border-b border-borderHalus/40 flex items-center justify-between">
          <span className="font-display font-bold text-xs tracking-wider text-textMain uppercase truncate">
            {label}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
            {algorithm === "nearest_neighbor" ? "NN" : algorithm === "jpeg_quality" ? "JPEG" : "SVD"}
          </span>
        </div>

        {/* Image Preview */}
        <div className="aspect-[4/3] w-full bg-background/90 relative overflow-hidden flex items-center justify-center border-b border-borderHalus/40">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              style={algorithm === "nearest_neighbor" ? { imageRendering: "pixelated" } : {}}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-xs text-textLabel">Memproses...</span>
            </div>
          )}

          {/* Zoom Overlay */}
          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="p-2.5 rounded-full bg-surfaceElevated border border-borderHalus shadow-lg flex items-center gap-2 text-xs font-semibold text-textMain">
              <Eye size={14} />
              <span>Perbesar</span>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div className="space-y-1 mb-4">
            {/* Pure / Native Compression */}
            <div className="flex items-center justify-between text-[11px] text-textSec font-mono">
              <span className="font-semibold text-textLabel">Ukuran Murni:</span>
              <span className="text-textMain font-semibold">{formatBytes(pureSize)}</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-textSec font-mono">
              <span className="font-semibold text-textLabel">Efisiensi Murni:</span>
              <span 
                className={`font-bold ${
                  pureReductionPercent > 0 
                    ? "text-accentTertiary" 
                    : pureReductionPercent < 0 
                      ? "text-error" 
                      : "text-textSec"
                }`}
              >
                {formatPercentage(pureReductionPercent)}
              </span>
            </div>

            {/* Separator line */}
            <div className="border-t border-borderHalus/40 my-2" />

            {/* PNG Container size */}
            <div className="flex items-center justify-between text-[11px] text-textSec font-mono">
              <span className="font-semibold text-textLabel">Ukuran PNG:</span>
              <span className="text-textMain font-semibold">{formatBytes(size)}</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-textSec font-mono">
              <span className="font-semibold text-textLabel">Efisiensi PNG:</span>
              <span 
                className={`font-bold ${
                  reductionPercent > 0 
                    ? "text-accentTertiary" 
                    : reductionPercent < 0 
                      ? "text-error" 
                      : "text-textSec"
                }`}
              >
                {formatPercentage(reductionPercent)}
              </span>
            </div>

            {/* Separator line */}
            <div className="border-t border-borderHalus/40 my-2" />

            <div className="flex items-center justify-between text-xs text-textSec font-mono">
              <span>Resolusi:</span>
              <span className="text-textMain">{width && height ? `${width} × ${height} px` : "-"}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-textSec font-mono">
              <span className="flex items-center gap-1"><Clock size={11} /> Durasi:</span>
              <span className="text-textMain">{formatDuration(durationMs)}</span>
            </div>
          </div>

          {/* Action Download */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering zoom
              onDownload();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-surfaceElevated hover:bg-borderHalus text-xs font-semibold border border-borderHalus text-textMain transition-all shadow-sm"
          >
            <Download size={12} />
            <span>Unduh PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
