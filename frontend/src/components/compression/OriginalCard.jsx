import React from "react";
import { formatBytes } from "../../utils/formatters";
import { Image as ImageIcon, Eye } from "lucide-react";

export default function OriginalCard({ name, size, width, height, previewUrl, onZoom }) {
  return (
    <div 
      onClick={onZoom}
      className="glass-panel rounded-xl overflow-hidden bg-surface/40 hover:bg-surface/60 border border-borderHalus hover:border-textSec/50 transition-all duration-300 group flex flex-col cursor-pointer"
    >
      {/* Title Header */}
      <div className="px-4 py-3 bg-surface/80 border-b border-borderHalus/40 flex items-center justify-between">
        <span className="font-display font-bold text-xs tracking-widest text-textSec uppercase">
          Original Image
        </span>
        <ImageIcon size={14} className="text-textSec" />
      </div>

      {/* Image Preview Container */}
      <div className="aspect-[4/3] w-full bg-background/90 relative overflow-hidden flex items-center justify-center border-b border-borderHalus/40">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Original"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <ImageIcon size={32} className="text-textLabel animate-pulse" />
            <span className="text-xs text-textLabel mt-2">Loading preview...</span>
          </div>
        )}

        {/* Hover Hover Overlay for zoom */}
        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-2.5 rounded-full bg-surfaceElevated border border-borderHalus shadow-lg flex items-center gap-2 text-xs font-semibold text-textMain">
            <Eye size={14} />
            <span>Perbesar</span>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="p-4 flex-grow flex flex-col justify-end">
        <h4 className="text-sm font-semibold text-textMain truncate mb-1" title={name}>
          {name}
        </h4>
        <div className="flex items-center justify-between text-xs text-textSec font-mono mt-1">
          <span>Ukuran:</span>
          <span className="text-textMain font-semibold">{formatBytes(size)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-textSec font-mono mt-1">
          <span>Dimensi:</span>
          <span className="text-textMain">{width && height ? `${width} × ${height} px` : "-"}</span>
        </div>
      </div>
    </div>
  );
}
