import React from "react";
import { CheckCircle2, Play, Loader2, AlertCircle, Trash2, Image } from "lucide-react";
import { formatBytes } from "../../utils/formatters";

export default function BatchList({
  files,
  selectedIndex,
  onSelect,
  onRemove,
  onProcessAll,
  isProcessingAny,
}) {
  const totalFiles = files.length;
  const processedFiles = files.filter(f => f.status === "completed").length;
  const progressPercent = totalFiles > 0 ? (processedFiles / totalFiles) * 100 : 0;

  return (
    <div className="glass-panel rounded-xl p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-textMain">
            Daftar Batch ({totalFiles} Gambar)
          </h3>
          <p className="text-xs text-textSec font-mono mt-0.5">
            Terkompresi: {processedFiles} / {totalFiles} ({Math.round(progressPercent)}%)
          </p>
        </div>

        {totalFiles > 0 && processedFiles < totalFiles && (
          <button
            onClick={onProcessAll}
            disabled={isProcessingAny}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-accentTertiary hover:bg-accentTertiary/80 text-background font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isProcessingAny ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span>Proses Semua</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {totalFiles > 0 && (
        <div className="w-full bg-background/60 rounded-full h-1.5 mb-4 overflow-hidden border border-borderHalus/30">
          <div
            className="bg-accentTertiary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Grid List */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {files.map((item, index) => {
          const isSelected = index === selectedIndex;
          const objectUrl = item.previewUrl || (item.file ? URL.createObjectURL(item.file) : "");
          
          return (
            <div
              key={item.id || index}
              onClick={() => onSelect(index)}
              className={`flex-none w-44 p-2 rounded-lg cursor-pointer border transition-all relative group ${
                isSelected
                  ? "bg-surfaceElevated border-accentPrimary/80 shadow-md scale-[0.98]"
                  : "bg-surface/50 border-borderHalus/60 hover:bg-surface/80 hover:border-textSec/40"
              }`}
            >
              {/* Thumbnail Container */}
              <div className="aspect-[4/3] w-full rounded bg-background/80 overflow-hidden relative border border-borderHalus flex items-center justify-center">
                {objectUrl ? (
                  <img
                    src={objectUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <Image size={24} className="text-textSec" />
                )}

                {/* Status Badges */}
                <div className="absolute top-1 right-1 p-0.5 rounded-full backdrop-blur-md bg-background/70 border border-borderHalus">
                  {item.status === "completed" && (
                    <CheckCircle2 size={14} className="text-accentTertiary" />
                  )}
                  {item.status === "processing" && (
                    <Loader2 size={14} className="text-accentPrimary animate-spin" />
                  )}
                  {item.status === "failed" && (
                    <AlertCircle size={14} className="text-error" />
                  )}
                  {item.status === "pending" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-warning m-0.5" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="mt-2 text-left">
                <p className="text-xs font-semibold text-textMain truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[10px] text-textSec font-mono mt-0.5">
                  {formatBytes(item.size)}
                </p>
              </div>

              {/* Remove Button */}
              {!isProcessingAny && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="absolute -top-1 -left-1 p-1 rounded-full bg-error text-background border border-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  title="Hapus gambar"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
