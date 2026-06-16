import React from "react";
import { Layers, Activity, HelpCircle } from "lucide-react";

export default function Header({ isServerHealthy, onOpenInfo }) {
  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b border-borderHalus/60 px-4 md:px-8 py-4 flex items-center justify-between">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-accentPrimary via-accentSecondary to-accentTertiary p-2 rounded-lg text-background shadow-md">
          <Layers size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-textMain flex items-center gap-2">
            Trinity<span className="bg-gradient-to-r from-accentPrimary via-accentSecondary to-accentTertiary bg-clip-text text-transparent">Press</span>
          </h1>
          <p className="text-[10px] text-textSec font-mono tracking-wider uppercase hidden sm:block">
            Image Compression Sandbox
          </p>
        </div>
      </div>

      {/* Control / Info */}
      <div className="flex items-center gap-4">
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surfaceElevated hover:bg-borderHalus text-xs md:text-sm font-medium border border-borderHalus text-textMain hover:text-white transition-all"
        >
          <HelpCircle size={14} />
          <span>Tentang</span>
        </button>
      </div>
    </header>
  );
}
