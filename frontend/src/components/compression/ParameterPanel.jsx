import React from "react";
import { Sliders, RotateCcw, Info } from "lucide-react";

export default function ParameterPanel({
  scaleFactor,
  jpegQuality = 30,
  svdRank,
  onChangeScale,
  onChangeQuality,
  onChangeRank,
  onReset,
  isProcessing,
}) {
  return (
    <div className="glass-panel rounded-xl p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-5 border-b border-borderHalus/40 pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-accentPrimary" />
          <h3 className="font-display font-bold text-lg text-textMain">
            Pengaturan Kompresi
          </h3>
        </div>
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surfaceElevated hover:bg-borderHalus text-xs font-semibold text-textSec transition-all disabled:opacity-50 border border-borderHalus/60"
        >
          <RotateCcw size={12} />
          <span>Reset ke Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nearest-Neighbor Scale Factor Slider */}
        <div className="space-y-3 p-4 rounded-lg bg-surface/30 border border-borderHalus/30 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border border-accentPrimary/30 bg-accentPrimary/10 text-accentPrimary">
            Nearest-Neighbor
          </div>
          
          <label className="block text-sm font-semibold text-textMain">
            Scale Factor
          </label>
          <p className="text-xs text-textSec">
            Mengatur persentase pengecilan gambar sebelum diperbesar kembali. Nilai lebih rendah = resolusi piksel lebih kasar (pixelated).
          </p>

          <div className="flex items-center gap-4 pt-2">
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={scaleFactor}
              disabled={isProcessing}
              onChange={(e) => onChangeScale(parseFloat(e.target.value))}
              className="flex-grow accent-accentPrimary h-1.5 bg-background rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="font-mono text-sm bg-background border border-borderHalus px-2.5 py-1 rounded text-accentPrimary font-bold w-14 text-center">
              {scaleFactor.toFixed(2)}
            </span>
          </div>
        </div>

        {/* JPEG Quality Slider */}
        <div className="space-y-3 p-4 rounded-lg bg-surface/30 border border-borderHalus/30 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border border-accentSecondary/30 bg-accentSecondary/10 text-accentSecondary">
            JPEG Quality
          </div>
          
          <label className="block text-sm font-semibold text-textMain">
            JPEG Quality (Q)
          </label>
          <p className="text-xs text-textSec">
            Mengatur kualitas kompresi JPEG. Nilai lebih rendah = kompresi lebih tinggi dan muncul artefak blok (blocking).
          </p>

          <div className="flex items-center gap-4 pt-2">
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={jpegQuality}
              disabled={isProcessing}
              onChange={(e) => onChangeQuality(parseInt(e.target.value, 10))}
              className="flex-grow accent-accentSecondary h-1.5 bg-background rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="font-mono text-sm bg-background border border-borderHalus px-2.5 py-1 rounded text-accentSecondary font-bold w-14 text-center">
              {jpegQuality}
            </span>
          </div>
        </div>

        {/* SVD Rank Slider */}
        <div className="space-y-3 p-4 rounded-lg bg-surface/30 border border-borderHalus/30 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border border-accentTertiary/30 bg-accentTertiary/10 text-accentTertiary">
            SVD
          </div>

          <label className="block text-sm font-semibold text-textMain">
            SVD Rank (k)
          </label>
          <p className="text-xs text-textSec">
            Jumlah nilai singular (singular values) yang dipertahankan. Nilai lebih rendah = kompresi lebih tinggi tapi gambar memudar/kabur (blur).
          </p>

          <div className="flex items-center gap-4 pt-2">
            <input
              type="range"
              min="1"
              max="200"
              step="1"
              value={svdRank}
              disabled={isProcessing}
              onChange={(e) => onChangeRank(parseInt(e.target.value, 10))}
              className="flex-grow accent-accentTertiary h-1.5 bg-background rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="font-mono text-sm bg-background border border-borderHalus px-2.5 py-1 rounded text-accentTertiary font-bold w-14 text-center">
              {svdRank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
