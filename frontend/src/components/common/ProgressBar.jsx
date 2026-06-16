import React from "react";

export default function ProgressBar({ progress, statusText }) {
  return (
    <div className="w-full max-w-md mx-auto my-6 p-5 glass-panel rounded-xl text-center shadow-lg border border-borderHalus">
      <div className="flex justify-between items-center text-xs text-textSec mb-2 font-mono">
        <span className="truncate max-w-[80%] text-left" title={statusText}>
          {statusText || "Memproses..."}
        </span>
        <span className="text-accentPrimary font-bold">{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full bg-background/80 rounded-full h-2 overflow-hidden border border-borderHalus/60">
        <div
          className="bg-gradient-to-r from-accentPrimary via-accentSecondary to-accentTertiary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-[10px] text-textLabel font-mono mt-2 animate-pulse">
        Harap tunggu, proses kompresi sedang berjalan paralel...
      </p>
    </div>
  );
}
