import React from "react";
import OriginalCard from "./OriginalCard";
import AlgorithmCard from "./AlgorithmCard";

const API_BASE = "http://localhost:5000";

/** Resolve relative API paths to absolute URLs */
function resolveUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function ResultGrid({ 
  original, 
  results, 
  onZoom, 
  onDownload 
}) {
  if (!original) return null;

  return (
    <div className="w-full mb-8">
      <h3 className="font-display font-bold text-lg text-textMain mb-4">
        Perbandingan Sisi ke Sisi
      </h3>
      
      {/* Container: Horizontal scrolling on mobile (snap layout), Grid on desktop */}
      <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 md:overflow-visible scrollbar-thin">
        {/* Original Card */}
        <div className="flex-none w-[280px] snap-center sm:w-[320px] md:w-auto md:flex-grow">
          <OriginalCard
            name={original.filename}
            size={original.size_bytes}
            width={original.width}
            height={original.height}
            previewUrl={resolveUrl(original.url)}
            onZoom={() => onZoom("original", "Original", original.url)}
          />
        </div>

        {/* Algorithm Cards */}
        {results && results.map((result) => (
          <div 
            key={result.algorithm} 
            className="flex-none w-[280px] snap-center sm:w-[320px] md:w-auto md:flex-grow"
          >
            <AlgorithmCard
              algorithm={result.algorithm}
              label={result.label}
              size={result.size_bytes}
              pureSize={result.pure_size_bytes}
              width={result.width}
              height={result.height}
              reductionPercent={result.reduction_percent}
              pureReductionPercent={result.pure_reduction_percent}
              durationMs={result.duration_ms}
              imageUrl={resolveUrl(result.url)}
              onZoom={() => onZoom(result.algorithm, result.label, result.url)}
              onDownload={() => onDownload(result.algorithm, result.url, original.filename)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
