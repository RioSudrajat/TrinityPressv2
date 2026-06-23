import React from "react";
import { X, Layers, Info, CheckCircle2 } from "lucide-react";

export default function AlgoInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="glass-panel rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-surfaceElevated shadow-2xl border border-borderHalus flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-borderHalus/60 flex items-center justify-between sticky top-0 bg-surfaceElevated z-10">
          <div className="flex items-center gap-2">
            <Info className="text-accentPrimary" size={20} />
            <h3 className="font-display font-bold text-lg text-textMain">
              Tentang TrinityPress & Algoritma
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-surface hover:bg-borderHalus text-textSec hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-textSec leading-relaxed">
          {/* Intro */}
          <div>
            <p className="text-textMain text-base">
              <strong>TrinityPress</strong> adalah aplikasi kompresi gambar berbasis web yang didesain sebagai <strong>sarana studi komparasi citra digital</strong>. Aplikasi ini membandingkan tiga algoritma kompresi berbeda secara berdampingan.
            </p>
          </div>

          <hr className="border-borderHalus/40" />

          {/* Algorithm 1 */}
          <div className="space-y-2 border-l-4 border-l-accentPrimary pl-4">
            <h4 className="font-display font-bold text-textMain text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accentPrimary" />
              Nearest-Neighbor Resampling
            </h4>
            <p>
              <strong>Konsep:</strong> Algoritma ini mengecilkan resolusi gambar (downscale) dengan mengambil nilai piksel terdekat tanpa interpolasi warna, kemudian memperbesarnya kembali (upscale) ke ukuran semula.
            </p>
            <p className="text-xs">
              <strong>Efek Visual:</strong> Gambar terlihat kotak-kotak kasar (pixelated). Ukuran PNG berkurang karena area warna seragam yang dihasilkan dapat dimampatkan secara efisien oleh kompresor internal PNG.
            </p>
          </div>

          {/* Algorithm 2 */}
          <div className="space-y-2 border-l-4 border-l-accentSecondary pl-4">
            <h4 className="font-display font-bold text-textMain text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accentSecondary" />
              JPEG Quality (Q=30)
            </h4>
            <p>
              <strong>Konsep:</strong> Menggunakan kompresi standar JPEG dengan tingkat kualitas rendah (Q=30). Algoritma ini mengubah gambar ke domain frekuensi menggunakan Discrete Cosine Transform (DCT) dan melakukan kuantisasi untuk membuang komponen frekuensi tinggi yang kurang sensitif bagi mata manusia.
            </p>
            <p className="text-xs">
              <strong>Efek Visual:</strong> Terlihat artefak kompresi berupa kotak-kotak halus (blocking) dan derau di sekitar tepi objek yang kontras (mosquito noise), namun ukuran file menjadi sangat kecil dan efisien.
            </p>
          </div>

          {/* Algorithm 3 */}
          <div className="space-y-2 border-l-4 border-l-accentTertiary pl-4">
            <h4 className="font-display font-bold text-textMain text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accentTertiary" />
              Singular Value Decomposition (SVD)
            </h4>
            <p>
              <strong>Konsep:</strong> Memperlakukan setiap channel warna gambar sebagai matriks matematika. SVD memfaktorkan matriks menjadi tiga matriks (U, Σ, Vᵀ) dan memotong data dengan hanya mempertahankan <strong>k</strong> nilai singular terbesar (low-rank approximation).
            </p>
            <p className="text-xs">
              <strong>Efek Visual:</strong> Gambar terlihat kabur/halus secara matematis (blur). Semakin kecil rank (k) yang diatur, semakin abstrak visual gambarnya karena komponen detail frekuensi tinggi dibuang.
            </p>
          </div>

          <hr className="border-borderHalus/40" />

          {/* Table Comparison */}
          <div>
            <h5 className="font-display font-bold text-textMain mb-3">Tabel Perbandingan Karakteristik</h5>
            <div className="overflow-x-auto rounded border border-borderHalus/60 bg-surface/30">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-surface/60 border-b border-borderHalus/60 font-mono text-textSec">
                    <th className="p-2.5">Aspek</th>
                    <th className="p-2.5">Nearest-Neighbor</th>
                    <th className="p-2.5">JPEG Quality (Q=30)</th>
                    <th className="p-2.5">SVD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderHalus/30 font-mono">
                  <tr>
                    <td className="p-2.5 font-bold text-textMain">Metodologi</td>
                    <td className="p-2.5">Spatial Resampling</td>
                    <td className="p-2.5">Frequency Domain (DCT)</td>
                    <td className="p-2.5">Matrix Factorization</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-textMain">Visual</td>
                    <td className="p-2.5 text-accentPrimary">Piksel/Kotak</td>
                    <td className="p-2.5 text-accentSecondary">Artefak Blok/Noise</td>
                    <td className="p-2.5 text-accentTertiary">Blur/Halus</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-textMain">Matematika</td>
                    <td className="p-2.5">Sampling Theory</td>
                    <td className="p-2.5">DCT & Quantization</td>
                    <td className="p-2.5">Linear Algebra (SVD)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-borderHalus/60 flex items-center justify-end bg-surfaceElevated sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-accentPrimary hover:bg-accentPrimary/80 text-background font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            Paham, Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
