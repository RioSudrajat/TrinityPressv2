import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-borderHalus/40 bg-background/80 py-6 px-4 md:px-8 text-center text-xs text-textSec font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p>© {new Date().getFullYear()} TrinityPress. Studi Komparasi Algoritma Kompresi Citra.</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accentPrimary" /> Nearest-Neighbor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accentSecondary" /> Chroma Subsampling
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accentTertiary" /> SVD
          </span>
        </div>
        <div>
          <p className="text-[10px] text-textLabel">Versi 1.0.0 (Draft)</p>
        </div>
      </div>
    </footer>
  );
}
