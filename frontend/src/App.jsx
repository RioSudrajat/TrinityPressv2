import React, { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingPage from "./components/layout/LandingPage";
import DropZone from "./components/upload/DropZone";
import BatchList from "./components/upload/BatchList";
import ResultGrid from "./components/compression/ResultGrid";
import ParameterPanel from "./components/compression/ParameterPanel";
import SummaryTable from "./components/compression/SummaryTable";
import Lightbox from "./components/common/Lightbox";
import AlgoInfoModal from "./components/common/AlgoInfoModal";
import Toast from "./components/common/Toast";
import ProgressBar from "./components/common/ProgressBar";
import { checkBackendHealth, compressImage, getZipDownloadUrl } from "./api/compression";
import { Layers, HelpCircle, UploadCloud, FileSpreadsheet, Download, RefreshCw, AlertTriangle, AlertCircle } from "lucide-react";

export default function App() {
  // App States
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // Global Parameters (for active image re-compression)
  const [scaleFactor, setScaleFactor] = useState(0.5);
  const [jpegQuality, setJpegQuality] = useState(30);
  const [svdRank, setSvdRank] = useState(50);
  
  // UI & Network States
  const [isServerHealthy, setIsServerHealthy] = useState(true);
  const [isProcessingAny, setIsProcessingAny] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  
  // Lightbox & Toast
  const [lightbox, setLightbox] = useState({ isOpen: false, algorithm: "original", title: "", imageUrl: "" });
  const [toast, setToast] = useState({ message: "", type: "error" });
  const [currentPage, setCurrentPage] = useState("landing");

  // 1. Initial health check on mount
  useEffect(() => {
    const runHealthCheck = async () => {
      try {
        await checkBackendHealth();
        setIsServerHealthy(true);
      } catch (err) {
        setIsServerHealthy(false);
        showToast(err.message, "error");
      }
    };
    runHealthCheck();
    
    // Poll health status every 30 seconds
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Debounce parameter changes for re-compression on active file
  useEffect(() => {
    if (selectedIndex === null || files.length === 0) return;
    const activeFile = files[selectedIndex];
    
    // Only trigger re-compression if the active file is already processed
    if (activeFile.status !== "completed") return;

    // Check if parameters actually changed from what's stored in the active file
    const storedScale = activeFile.params?.scaleFactor;
    const storedQuality = activeFile.params?.jpegQuality;
    const storedRank = activeFile.params?.svdRank;
    
    if (storedScale === scaleFactor && storedQuality === jpegQuality && storedRank === svdRank) return;

    const timer = setTimeout(() => {
      handleRecompress(selectedIndex, scaleFactor, jpegQuality, svdRank);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [scaleFactor, jpegQuality, svdRank, selectedIndex]);

  // Synchronize parameter panel with active file parameter values
  useEffect(() => {
    if (selectedIndex !== null && files[selectedIndex]) {
      const activeFile = files[selectedIndex];
      if (activeFile.status === "completed" && activeFile.params) {
        setScaleFactor(activeFile.params.scaleFactor);
        setJpegQuality(activeFile.params.jpegQuality || 30);
        setSvdRank(activeFile.params.svdRank);
      }
    }
  }, [selectedIndex]);

  // Helper: Display custom toasts
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Action: Select files from DropZone
  const handleFilesSelected = (newFiles) => {
    const formatted = newFiles.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      status: "pending",
      previewUrl: URL.createObjectURL(file),
      original: null,
      results: null,
      sessionId: null,
      params: null,
    }));

    setFiles((prev) => {
      const updated = [...prev, ...formatted];
      // Automatically focus on the first newly uploaded file
      if (prev.length === 0) {
        setSelectedIndex(0);
      }
      return updated;
    });

    showToast(`Berhasil menambahkan ${newFiles.length} file. Klik "Proses Semua" atau pilih file untuk kompresi.`, "success");
  };

  // Action: Remove file from batch
  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => {
      // Clean up object URLs
      if (prev[indexToRemove] && prev[indexToRemove].previewUrl) {
        URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      }
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      
      // Update selected index
      if (updated.length === 0) {
        setSelectedIndex(null);
      } else if (selectedIndex >= updated.length) {
        setSelectedIndex(updated.length - 1);
      }
      return updated;
    });
  };

  // Core Compression logic
  const runCompressionAPI = async (fileObj, scale, quality, rank) => {
    setProgress(10);
    setStatusText(`Mengunggah "${fileObj.name}"...`);

    const result = await compressImage(
      fileObj.file, 
      scale, 
      quality,
      rank,
      (progressEvent) => {
        const uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Map upload to 10% - 40% range
        setProgress(10 + uploadPercent * 0.3);
      }
    );

    setProgress(50);
    setStatusText("Server sedang memproses Nearest-Neighbor & JPEG Quality...");
    
    // Simulate progression step for user visual feedback
    setProgress(75);
    setStatusText("Menyelesaikan dekomposisi matriks SVD...");
    
    setProgress(100);
    return result;
  };

  // Action: Re-compress single file when parameters are changed
  const handleRecompress = async (index, scale, quality, rank) => {
    if (isProcessingAny) return;
    
    setIsProcessingAny(true);
    setStatusText(`Mencoba re-kompresi dengan parameter baru...`);
    
    setFiles((prev) => {
      const updated = [...prev];
      updated[index].status = "processing";
      return updated;
    });

    try {
      const data = await runCompressionAPI(files[index], scale, quality, rank);
      
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: "completed",
          original: data.original,
          results: data.results,
          sessionId: data.session_id,
          params: { scaleFactor: scale, jpegQuality: quality, svdRank: rank },
        };
        return updated;
      });
      showToast("Re-kompresi berhasil!", "success");
    } catch (err) {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = "failed";
        return updated;
      });
      showToast(err.message, "error");
    } finally {
      setIsProcessingAny(false);
      setProgress(0);
    }
  };

  // Action: Compress a single file on-demand or sequentially
  const compressSingleFile = async (index) => {
    // Current file parameters
    const scale = scaleFactor;
    const quality = jpegQuality;
    const rank = svdRank;

    setFiles((prev) => {
      const updated = [...prev];
      updated[index].status = "processing";
      return updated;
    });

    try {
      const data = await runCompressionAPI(files[index], scale, quality, rank);
      
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: "completed",
          original: data.original,
          results: data.results,
          sessionId: data.session_id,
          params: { scaleFactor: scale, jpegQuality: quality, svdRank: rank },
        };
        return updated;
      });
    } catch (err) {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = "failed";
        return updated;
      });
      throw err;
    } finally {
      setProgress(0);
    }
  };

  // Action: Trigger compression on all pending files sequentially
  const handleProcessAll = async () => {
    if (files.length === 0 || isProcessingAny) return;

    setIsProcessingAny(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === "pending" || item.status === "failed") {
        // Switch view to active processing item
        setSelectedIndex(i);
        try {
          await compressSingleFile(i);
          successCount++;
        } catch (err) {
          failCount++;
          showToast(`Gagal memproses "${item.name}": ${err.message}`, "error");
        }
      }
    }

    setIsProcessingAny(false);
    
    if (successCount > 0) {
      showToast(`Batch selesai! ${successCount} gambar berhasil dikompresi.`, "success");
    }
  };

  // Action: Reset parameters to default
  const handleResetParams = () => {
    setScaleFactor(0.5);
    setJpegQuality(30);
    setSvdRank(50);
  };

  // Download Trigger: Single image
  const handleDownloadSingle = (algorithm, relativeUrl, originalName) => {
    const absoluteUrl = `http://localhost:5000${relativeUrl}`;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."));
    const ext = "png";
    
    const link = document.createElement("a");
    link.href = absoluteUrl;
    link.setAttribute("download", `${nameWithoutExt}_${algorithm}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Trigger: Zip of all algorithms
  const handleDownloadZip = (sessionId, originalName) => {
    const url = getZipDownloadUrl(sessionId);
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${nameWithoutExt}_all_compressed.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Event: Zoom image in Lightbox
  const handleZoom = (algorithm, title, imageUrl) => {
    const activeFile = files[selectedIndex];
    if (!activeFile) return;

    // Resolve URL to full backend URL
    const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`;

    setLightbox({
      isOpen: true,
      algorithm,
      title,
      imageUrl: fullImageUrl,
    });
  };

  const activeFile = selectedIndex !== null ? files[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col justify-between bg-grid-pattern relative">
      
      {/* Background radial ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brandPrimary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accentPrimary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <Header 
        isServerHealthy={isServerHealthy} 
        onOpenInfo={() => setIsInfoOpen(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {currentPage === "landing" ? (
        <LandingPage 
          onStartCompression={() => setCurrentPage("app")}
          isServerHealthy={isServerHealthy}
        />
      ) : (
        /* Main App */
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 z-10 relative">
          
          {/* Offline Alert Banner */}
          {!isServerHealthy && (
            <div className="mb-6 p-4 rounded-lg bg-error/15 border border-error/30 text-error text-sm flex items-center gap-3 animate-pulse">
              <AlertTriangle className="shrink-0" size={18} />
              <div>
                <span className="font-bold">Backend Flask Tidak Terdeteksi:</span> Aplikasi berjalan dalam mode offline. Pastikan backend aktif di <code className="bg-background/80 px-1 py-0.5 rounded text-xs">http://localhost:5000</code> untuk menjalankan kompresi gambar.
              </div>
            </div>
          )}

          {files.length === 0 ? (
            /* Empty State Dashboard */
            <div className="max-w-3xl mx-auto my-12 text-center">
              <div className="mb-8">
                <h2 className="font-display font-bold text-3xl md:text-5xl text-textMain tracking-tight mb-4 leading-tight">
                  Tiga cara kompresi. <br />
                  Satu gambar. Lihat perbedaannya.
                </h2>
                <p className="text-sm md:text-base text-textSec max-w-xl mx-auto">
                  trinitypress menyediakan visualisasi komparatif secara side-by-side untuk metode Nearest-Neighbor, JPEG Quality (Q=30), dan SVD.
                </p>
              </div>

              {/* Dropzone Container */}
              <DropZone 
                onFilesSelected={handleFilesSelected} 
                onError={(msg) => showToast(msg, "error")} 
              />

              {/* Educational Info Strip */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-5 glass-panel rounded-xl border border-borderHalus/40">
                  <span className="h-1.5 w-8 bg-accentPrimary rounded-full block mb-3" />
                  <h4 className="font-display font-semibold text-textMain text-sm mb-1">Nearest Neighbor</h4>
                  <p className="text-xs text-textSec">
                    Mengubah skala gambar (downscale/upscale). Sangat cepat namun memicu efek visual pixelated kasar.
                  </p>
                </div>
                <div className="p-5 glass-panel rounded-xl border border-borderHalus/40">
                  <span className="h-1.5 w-8 bg-accentSecondary rounded-full block mb-3" />
                  <h4 className="font-display font-semibold text-textMain text-sm mb-1">JPEG Quality (Q=30)</h4>
                  <p className="text-xs text-textSec">
                    Kompresi standar JPEG dengan kualitas rendah. Menggunakan DCT dan kuantisasi untuk membuang detail frekuensi tinggi.
                  </p>
                </div>
                <div className="p-5 glass-panel rounded-xl border border-borderHalus/40">
                  <span className="h-1.5 w-8 bg-accentTertiary rounded-full block mb-3" />
                  <h4 className="font-display font-semibold text-textMain text-sm mb-1">SVD Decomposition</h4>
                  <p className="text-xs text-textSec">
                    Memotong matrik linear algebra citra dengan parameter rank. Menciptakan gradasi visual yang halus/blur.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Compression Dashboard */
            <div>
              {/* Batch List Tracker */}
              <BatchList
                files={files}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                onRemove={handleRemoveFile}
                onProcessAll={handleProcessAll}
                isProcessingAny={isProcessingAny}
              />

              {/* Processing State */}
              {isProcessingAny && progress > 0 && (
                <ProgressBar progress={progress} statusText={statusText} />
              )}

              {activeFile && (
                <div className="space-y-6">
                  
                  {/* Active Image Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/30 p-4 rounded-xl border border-borderHalus/40">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-surfaceElevated rounded border border-borderHalus overflow-hidden">
                        <img 
                          src={activeFile.previewUrl} 
                          alt="Thumbnail" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-lg text-textMain leading-tight truncate max-w-sm sm:max-w-md">
                          {activeFile.name}
                        </h2>
                        <p className="text-xs text-textSec font-mono">
                          Status:{" "}
                          <span 
                            className={`font-semibold uppercase ${
                              activeFile.status === "completed"
                                ? "text-accentTertiary"
                                : activeFile.status === "processing"
                                  ? "text-accentPrimary"
                                  : activeFile.status === "failed"
                                    ? "text-error"
                                    : "text-warning"
                            }`}
                          >
                            {activeFile.status === "completed"
                              ? "Selesai"
                              : activeFile.status === "processing"
                                ? "Memproses..."
                                : activeFile.status === "failed"
                                  ? "Gagal"
                                  : "Menunggu"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {activeFile.status === "completed" && (
                      <button
                        onClick={() => handleDownloadZip(activeFile.sessionId, activeFile.name)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-accentPrimary hover:bg-accentPrimary/80 text-background font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                      >
                        <Download size={14} />
                        <span>Unduh Semua (ZIP)</span>
                      </button>
                    )}

                    {activeFile.status === "pending" && !isProcessingAny && (
                      <button
                        onClick={() => compressSingleFile(selectedIndex)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-accentTertiary hover:bg-accentTertiary/80 text-background font-bold text-xs tracking-wider uppercase transition-all shadow-md animate-pulse"
                      >
                        <RefreshCw size={14} />
                        <span>Proses Gambar Ini</span>
                      </button>
                    )}

                    {activeFile.status === "failed" && !isProcessingAny && (
                      <button
                        onClick={() => compressSingleFile(selectedIndex)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-error hover:bg-error/80 text-background font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                      >
                        <RefreshCw size={14} />
                        <span>Coba Lagi</span>
                      </button>
                    )}
                  </div>

                  {/* Parameter Panel Tuning */}
                  <ParameterPanel
                    scaleFactor={scaleFactor}
                    jpegQuality={jpegQuality}
                    svdRank={svdRank}
                    onChangeScale={(val) => setScaleFactor(val)}
                    onChangeQuality={(val) => setJpegQuality(val)}
                    onChangeRank={(val) => setSvdRank(val)}
                    onReset={handleResetParams}
                    isProcessing={isProcessingAny || activeFile.status !== "completed"}
                  />

                  {/* Main Results grid display */}
                  {activeFile.status === "completed" && activeFile.original && (
                    <>
                      <ResultGrid
                        original={activeFile.original}
                        results={activeFile.results}
                        onZoom={handleZoom}
                        onDownload={handleDownloadSingle}
                      />

                      {/* Summary statistics comparison table */}
                      <SummaryTable results={activeFile.results} />
                    </>
                  )}

                  {/* Pending or Processing UI Placeholder */}
                  {activeFile.status !== "completed" && !isProcessingAny && (
                    <div className="glass-panel rounded-xl p-12 text-center border border-borderHalus">
                      <AlertCircle size={36} className="text-warning mx-auto mb-4 animate-bounce" />
                      <h3 className="font-display font-semibold text-textMain text-base mb-2">
                        Gambar Belum Diproses
                      </h3>
                      <p className="text-xs text-textSec max-w-sm mx-auto mb-6">
                        Klik tombol "Proses Gambar Ini" di atas atau jalankan batch dengan tombol "Proses Semua" untuk menampilkan perbandingan kompresi.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Lightbox Zoom Comparison Overlay */}
      {activeFile && (
        <Lightbox
          isOpen={lightbox.isOpen}
          onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
          original={activeFile.original}
          results={activeFile.results || []}
          defaultAlgorithm={lightbox.algorithm}
        />
      )}

      {/* Educational Information Modal */}
      <AlgoInfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
      />

      {/* Toast Alert Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
}
