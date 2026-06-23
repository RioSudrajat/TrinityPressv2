import React from "react";
import { Layers, Activity, HelpCircle } from "lucide-react";

export default function Header({ isServerHealthy, onOpenInfo, currentPage, onPageChange }) {
  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b border-borderHalus/60 px-4 md:px-8 py-4 flex items-center justify-between">
      {/* Branding */}
      <div 
        onClick={() => onPageChange("landing")} 
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="bg-brandPrimary p-2 rounded-lg text-black shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
          <Layers size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <h1 className="font-display text-lg md:text-xl font-extrabold tracking-tight text-black flex items-center gap-1">
            trinity<span className="bg-black text-brandPrimary px-2 py-0.5 rounded-lg text-xs md:text-sm font-bold shadow-sm">press</span>
          </h1>
          <p className="text-[10px] text-textLabel font-mono tracking-wider uppercase hidden sm:block mt-0.5">
            Image Compression Sandbox
          </p>
        </div>
      </div>

      {/* Control / Info / Navigation */}
      <div className="flex items-center gap-3">
        {/* Navigation page switcher */}
        {currentPage === "landing" ? (
          <button
            onClick={() => onPageChange("app")}
            className="px-4 py-1.5 rounded-full bg-brandPrimary hover:bg-black hover:text-brandPrimary text-black font-bold text-xs md:text-sm transition-all duration-300 shadow-sm border-2 border-transparent hover:border-brandPrimary cursor-pointer"
          >
            Buka Aplikasi
          </button>
        ) : (
          <button
            onClick={() => onPageChange("landing")}
            className="px-4 py-1.5 rounded-full bg-surfaceElevated hover:bg-borderHalus text-textSec hover:text-textMain font-bold text-xs md:text-sm border border-borderHalus transition-colors shadow-sm cursor-pointer"
          >
            Beranda
          </button>
        )}

        {/* Health Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surfaceElevated border border-borderHalus text-xs font-mono">
          <Activity size={12} className={isServerHealthy ? "text-accentTertiary" : "text-error"} />
          <span className="hidden sm:inline text-textSec">Server:</span>
          {isServerHealthy ? (
            <span className="text-accentTertiary font-medium">ONLINE</span>
          ) : (
            <span className="text-error font-medium">OFFLINE</span>
          )}
          <span className={`h-2 w-2 rounded-full ${isServerHealthy ? "bg-accentTertiary animate-ping" : "bg-error"} ml-1`} />
        </div>

        {/* About Button */}
        <button
          onClick={onOpenInfo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surfaceElevated hover:bg-borderHalus text-xs md:text-sm font-medium border border-borderHalus text-textMain transition-all cursor-pointer"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:inline">Tentang</span>
        </button>
      </div>
    </header>
  );
}
