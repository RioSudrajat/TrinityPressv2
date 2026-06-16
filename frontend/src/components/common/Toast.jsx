import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "error", onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  let icon = <XCircle className="text-error shrink-0" size={16} />;
  let borderClass = "border-error/40";
  let bgClass = "bg-error/10";

  if (type === "success") {
    icon = <CheckCircle2 className="text-accentTertiary shrink-0" size={16} />;
    borderClass = "border-accentTertiary/40";
    bgClass = "bg-accentTertiary/10";
  } else if (type === "warning") {
    icon = <AlertTriangle className="text-warning shrink-0" size={16} />;
    borderClass = "border-warning/40";
    bgClass = "bg-warning/10";
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center justify-between gap-3 p-4 rounded-lg shadow-2xl glass-panel-elevated max-w-sm border animate-slide-up">
      <div className={`flex items-center gap-2.5 p-1 rounded-md ${bgClass} border ${borderClass}`}>
        {icon}
      </div>
      <div className="flex-grow text-left">
        <p className="text-xs font-semibold text-textMain">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-surfaceElevated text-textSec hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
