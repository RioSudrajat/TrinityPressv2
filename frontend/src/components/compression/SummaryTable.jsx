import React from "react";
import { formatBytes, formatPercentage, formatDuration } from "../../utils/formatters";
import { Table, Zap, ShieldCheck } from "lucide-react";

export default function SummaryTable({ results }) {
  if (!results || results.length === 0) return null;

  // Find the highest compression (maximum reduction percent)
  const bestResult = results.reduce((prev, current) => {
    return (current.reduction_percent > prev.reduction_percent) ? current : prev;
  }, results[0]);

  return (
    <div className="glass-panel rounded-xl p-5 md:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Table size={18} className="text-accentTertiary" />
        <h3 className="font-display font-bold text-lg text-textMain">
          Ringkasan Perbandingan
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderHalus/60 text-xs font-mono text-textSec uppercase">
              <th className="py-3 px-4">Algoritma</th>
              <th className="py-3 px-4">Ukuran File</th>
              <th className="py-3 px-4">Pengurangan</th>
              <th className="py-3 px-4">Kecepatan</th>
              <th className="py-3 px-4 text-right">Rekomendasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderHalus/30">
            {results.map((row) => {
              const isBest = row.algorithm === bestResult.algorithm;
              
              // Get algorithm class/indicator colors
              let borderClass = "border-l-4 border-l-accentPrimary";
              let textAccent = "text-accentPrimary";
              
              if (row.algorithm === "chroma_subsampling") {
                borderClass = "border-l-4 border-l-accentSecondary";
                textAccent = "text-accentSecondary";
              } else if (row.algorithm === "svd") {
                borderClass = "border-l-4 border-l-accentTertiary";
                textAccent = "text-accentTertiary";
              }

              return (
                <tr 
                  key={row.algorithm}
                  className={`transition-colors text-sm ${
                    isBest 
                      ? "bg-accentTertiary/5 font-semibold" 
                      : "hover:bg-surface/25"
                  }`}
                >
                  <td className={`py-4 px-4 font-display text-textMain ${borderClass}`}>
                    {row.label}
                  </td>
                  <td className="py-4 px-4 font-mono text-textMain">
                    {formatBytes(row.size_bytes)}
                  </td>
                  <td className={`py-4 px-4 font-mono ${row.reduction_percent > 0 ? "text-accentTertiary" : "text-error"}`}>
                    {formatPercentage(row.reduction_percent)}
                  </td>
                  <td className="py-4 px-4 font-mono text-textSec">
                    {formatDuration(row.duration_ms)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {isBest ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accentTertiary/20 text-accentTertiary text-[11px] font-semibold border border-accentTertiary/30 animate-pulse">
                        <Zap size={10} />
                        Kompresi Maksimal
                      </span>
                    ) : (
                      <span className="text-xs text-textLabel">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
