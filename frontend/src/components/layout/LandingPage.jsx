import React, { useState } from "react";
import { 
  UploadCloud, 
  Sliders, 
  FileImage, 
  Maximize2, 
  Download, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Shield,
  CheckCircle2
} from "lucide-react";

export default function LandingPage({ onStartCompression, isServerHealthy }) {
  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Diagram active step
  const [activeStep, setActiveStep] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      title: "Unggah Citra",
      subtitle: "Input Gambar",
      desc: "Seret dan letakkan file gambar Anda (JPG, PNG, WEBP, BMP) hingga batas 10 MB. Sistem membaca file secara biner dan mencatat ukuran mentahnya sebelum dikompresi.",
      icon: <UploadCloud size={20} />,
      positionClass: "left-[20%] top-[20%]",
      checklist: [
        "Mendukung format PNG, JPG, WEBP, dan BMP",
        "Ukuran berkas mentah maksimal 10 MB",
        "Validasi tipe file via magic bytes di server"
      ]
    },
    {
      title: "Nearest-Neighbor",
      subtitle: "Engine NNR",
      desc: "Menyusutkan dimensi gambar (downscale) dengan membuang piksel antara, lalu menaikkan skalanya kembali (upscale) menggunakan interpolasi piksel terdekat agar dimensi tetap 100%.",
      icon: <Sliders size={20} />,
      positionClass: "left-[80%] top-[20%]",
      checklist: [
        "Downscale cepat tanpa anti-aliasing",
        "Upscale NEAREST mengembalikan dimensi 100%",
        "Membuat blok warna seragam agar efisien di PNG"
      ]
    },
    {
      title: "JPEG Quality",
      subtitle: "Engine JPEG",
      desc: "Memotong detail frekuensi tinggi dari citra asli menggunakan kuantisasi matematika Discrete Cosine Transform (DCT) pada blok-blok berukuran 8x8 piksel.",
      icon: <FileImage size={20} />,
      positionClass: "left-[10%] top-[50%]",
      checklist: [
        "Kompresi lossy berbasis persepsi mata",
        "Kuantisasi nilai DCT pada matriks 8x8",
        "Hasil didekompresi kembali ke format RGB"
      ]
    },
    {
      title: "SVD Decomposition",
      subtitle: "Engine SVD",
      desc: "Memecah citra menjadi matriks U, S, dan V. Kompresi dilakukan dengan mempertahankan rank nilai singular teratas (rank-k) untuk membuang variasi detail yang kurang signifikan.",
      icon: <Maximize2 size={20} />,
      positionClass: "left-[20%] top-[80%]",
      checklist: [
        "Dekomposisi aljabar linier matrix channel warna",
        "Pengurangan dimensi data lewat parameter rank-k",
        "Visualisasi rekontruksi halus berkarakter blur"
      ]
    },
    {
      title: "ZIP & PNG Export",
      subtitle: "Output Hasil",
      desc: "Citra hasil pemrosesan dikemas ulang menjadi kontainer PNG standar. Anda dapat mengunduh berkas kompresi tunggal atau mengekspor seluruh batch dalam format ZIP.",
      icon: <Download size={20} />,
      positionClass: "left-[80%] top-[80%]",
      checklist: [
        "Pemuatan berkas unduhan berekstensi .png",
        "Ekspor ZIP paralel untuk kompresi batch",
        "Perbandingan transparan ukuran murni vs PNG"
      ]
    }
  ];

  const faqs = [
    {
      q: "Mengapa ukuran file PNG terkadang jauh lebih besar dibanding berkas JPEG asli saya?",
      a: "PNG adalah format lossless (tanpa kehilangan data) menggunakan algoritma Deflate (seperti ZIP). Sementara JPEG adalah format lossy yang membuang banyak detail tidak penting. Saat citra JPEG yang sudah terkompresi dikonversi paksa menjadi PNG, kompresor PNG dipaksa untuk melestarikan seluruh noise visual dan artefak kompresi JPEG tersebut secara lossless. Hal ini menyebabkan kapasitas file PNG membengkak melebihi JPEG aslinya."
    },
    {
      q: "Apa perbedaan antara Ukuran Murni (Pure Size) dan Ukuran PNG?",
      a: "Ukuran Murni adalah ukuran riil dari data hasil kompresi algoritma itu sendiri (misalnya ukuran file biner JPEG asli, ukuran citra NNR beresolusi rendah, atau ukuran representasi data matriks SVD). Ukuran PNG adalah ukuran berkas fisik setelah data tersebut diubah kembali menjadi citra berdimensi penuh (100% skala) dan dikemas dalam wadah format PNG untuk diunduh."
    },
    {
      q: "Bagaimana cara kerja algoritma SVD dalam kompresi gambar?",
      a: "SVD (Singular Value Decomposition) memperlakukan setiap channel warna citra (RGB) sebagai matriks angka. SVD memecah matriks tersebut menjadi komponen-komponen terpisah dan hanya menyisakan nilai singular terbesar (rank-k) yang paling mewakili struktur gambar utama. Hal ini membuang informasi detail halus (membuat gambar tampak blur) dan menghemat kapasitas data penyimpanan secara signifikan."
    },
    {
      q: "Apakah file gambar yang saya unggah aman?",
      a: "Sangat aman. Seluruh gambar yang Anda unggah diproses dalam sesi temporer yang unik di server lokal. Kami juga menerapkan sistem pembersih otomatis latar belakang (cleanup scheduler) yang akan menghapus seluruh file sesi Anda dari memiringan disk setelah sesi kadaluwarsa (maksimal 30 menit)."
    }
  ];

  return (
    <div className="w-full bg-background text-textMain bg-grid-pattern transition-colors duration-700 ease-in-out selection:bg-brandPrimary selection:text-black">
      
      {/* 1. Hero Section (Full Screen / Height) */}
      <section className="w-full min-h-[90vh] flex items-center justify-center py-20 px-6 border-b border-borderHalus bg-background/50">
        <div className="max-w-7xl mx-auto w-full text-center flex flex-col items-center justify-center">
          
          {/* Trust Tag List (Eyebrow) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-[11px] font-mono text-textLabel bg-white py-2.5 px-5 rounded-full border border-borderHalus shadow-sm">
            <span className="flex items-center gap-1.5"><Shield size={12} className="text-black" /> Preservasi</span>
            <span className="h-3 w-px bg-borderHalus" />
            <span className="flex items-center gap-1.5"><Sliders size={12} className="text-black" /> Efisiensi</span>
            <span className="h-3 w-px bg-borderHalus" />
            <span className="flex items-center gap-1.5"><Maximize2 size={12} className="text-black" /> Komparasi</span>
          </div>

          {/* Title Wordmark (lowercase brand) */}
          <span className="text-xs font-mono tracking-widest text-textLabel uppercase mb-3">introducing</span>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-black mb-6 leading-none">
            trinity<span className="text-brandPrimary bg-black px-5 py-1.5 rounded-2xl ml-1 shadow-md">press</span>
          </h1>

          {/* H2 Statement Heading */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-textSec mb-6 max-w-3xl leading-snug">
            Bandingkan performa murni algoritma kompresi citra secara transparan.
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-textLabel max-w-2xl mb-10 font-light">
            Analisis dan bandingkan kompresi <strong>Nearest-Neighbor</strong>, <strong>JPEG Quality</strong>, dan <strong>SVD</strong> secara visual. trinitypress menyajikan data murni algoritma bersanding dengan hasil wadah kontainer PNG secara real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onStartCompression}
              className="px-8 py-4 rounded-full bg-brandPrimary hover:bg-black hover:text-brandPrimary text-black font-bold text-base transition-all duration-300 shadow-md flex items-center gap-2 group cursor-pointer border-2 border-transparent hover:border-brandPrimary"
            >
              <span>Mulai Kompresi</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full bg-white hover:bg-surfaceElevated text-textSec font-bold text-sm border border-borderHalus transition-colors shadow-sm"
            >
              Pelajari Cara Kerja
            </a>
          </div>

        </div>
      </section>

      {/* 2. "How It Works" Diagram Section (Full Screen Width) */}
      <section id="how-it-works" className="w-full py-24 bg-white border-b border-borderHalus transition-colors duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Explanations & Checklist */}
          <div className="lg:col-span-5 text-left flex flex-col justify-center">
            <span className="text-xs font-mono font-bold text-black uppercase tracking-widest bg-brandSecondary py-1.5 px-3 rounded-md w-fit mb-4">
              ALUR SISTEM
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-black mb-6 leading-tight">
              Satu hub.<br />Pemrosesan paralel.
            </h3>
            <p className="text-textSec text-sm sm:text-base mb-8 leading-relaxed font-light">
              trinitypress bertindak sebagai pusat pemrosesan citra. Saat Anda mengunggah gambar, sistem memecah dan mendistribusikannya ke tiga mesin algoritma secara bersamaan untuk dievaluasi.
            </p>

            {/* Step Checklist dynamically populated based on active step */}
            <div className="space-y-3 mb-8">
              {steps[activeStep].checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-textSec font-light">
                  <CheckCircle2 size={16} className="text-black shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Active Step Details Panel */}
            <div className="bg-background/40 rounded-2xl border border-borderHalus p-5 shadow-sm min-h-[140px] transition-all duration-300">
              <span className="text-[10px] font-mono font-bold text-textLabel uppercase tracking-widest block mb-2">
                DETAIL PROSES: {steps[activeStep].subtitle}
              </span>
              <h4 className="font-display font-bold text-base text-black mb-1.5">
                {steps[activeStep].title}
              </h4>
              <p className="text-textLabel text-xs leading-relaxed font-light">
                {steps[activeStep].desc}
              </p>
            </div>
          </div>

          {/* Right Side: Visual hub-and-spoke connection diagram (Screenshot style) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[500px] aspect-square bg-[#F9F9F9] rounded-3xl border border-borderHalus shadow-sm p-8 relative overflow-hidden bg-grid-pattern">
              
              {/* SVG connection lines radiating from spokes to center */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <path 
                  d="M 20 20 Q 35 35 50 50" 
                  fill="none" 
                  stroke={activeStep === 0 ? "#ABF600" : "#D4D4D4"} 
                  strokeWidth={activeStep === 0 ? "1.5" : "0.8"} 
                  strokeDasharray={activeStep === 0 ? "0" : "3"} 
                  className="transition-all duration-300"
                />
                <path 
                  d="M 80 20 Q 65 35 50 50" 
                  fill="none" 
                  stroke={activeStep === 1 ? "#ABF600" : "#D4D4D4"} 
                  strokeWidth={activeStep === 1 ? "1.5" : "0.8"} 
                  strokeDasharray={activeStep === 1 ? "0" : "3"} 
                  className="transition-all duration-300"
                />
                <path 
                  d="M 12 50 Q 30 50 50 50" 
                  fill="none" 
                  stroke={activeStep === 2 ? "#ABF600" : "#D4D4D4"} 
                  strokeWidth={activeStep === 2 ? "1.5" : "0.8"} 
                  strokeDasharray={activeStep === 2 ? "0" : "3"} 
                  className="transition-all duration-300"
                />
                <path 
                  d="M 20 80 Q 35 65 50 50" 
                  fill="none" 
                  stroke={activeStep === 3 ? "#ABF600" : "#D4D4D4"} 
                  strokeWidth={activeStep === 3 ? "1.5" : "0.8"} 
                  strokeDasharray={activeStep === 3 ? "0" : "3"} 
                  className="transition-all duration-300"
                />
                <path 
                  d="M 80 80 Q 65 65 50 50" 
                  fill="none" 
                  stroke={activeStep === 4 ? "#ABF600" : "#D4D4D4"} 
                  strokeWidth={activeStep === 4 ? "1.5" : "0.8"} 
                  strokeDasharray={activeStep === 4 ? "0" : "3"} 
                  className="transition-all duration-300"
                />
              </svg>

              {/* Central Hub (Source of Truth) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                <div className="bg-black text-brandPrimary px-4 py-2.5 rounded-2xl shadow-lg border border-borderHalus flex flex-col items-center gap-1 select-none">
                  <Layers size={18} className="animate-pulse-slow" />
                  <span className="text-[9px] font-mono text-textLabel uppercase tracking-widest">hub</span>
                  <span className="text-[10px] font-display font-extrabold tracking-tight">trinitypress</span>
                </div>
              </div>

              {/* Spoke Nodes */}
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveStep(idx)}
                    onClick={() => setActiveStep(idx)}
                    className={`absolute ${step.positionClass} -translate-x-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group ${
                      isActive 
                        ? "bg-brandSecondary border-brandPrimary shadow-md scale-110 text-black"
                        : "bg-white border-borderHalus/80 text-textSec hover:border-black hover:scale-105"
                    }`}
                    title={step.title}
                  >
                    <div className="flex items-center justify-center">
                      {step.icon}
                    </div>
                    {/* Node text floating label */}
                    <span className={`absolute top-[110%] font-mono text-[9px] uppercase tracking-wider transition-colors font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-white/95 border border-borderHalus/40 shadow-sm ${
                      isActive ? "text-black border-brandPrimary" : "text-textLabel group-hover:text-black"
                    }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* 3. Pure Algorithmic Explanations Section (Full Screen Width) */}
      <section className="w-full py-24 bg-background/50 border-b border-borderHalus transition-colors duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
          
          {/* NNR Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-6 flex flex-col justify-center text-left">
              <span className="text-xs font-mono font-bold text-black uppercase tracking-widest mb-3">
                Nearest-Neighbor Resampling
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-black mb-4 leading-snug">
                Mengorbankan kepadatan piksel demi efisiensi optimal berkas.
              </h3>
              <p className="text-textSec text-sm sm:text-base leading-relaxed font-light">
                NNR membuang baris dan kolom piksel menggunakan interpolasi terdekat untuk memperkecil ukuran gambar. Piksel yang tersisa membentuk pola kotak-kotak besar yang solid. Pola warna datar yang luas ini sangat disukai oleh format PNG lossless, sehingga ukuran kontainer PNG-nya tetap efisien.
              </p>
            </div>
            <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-borderHalus shadow-sm flex items-center justify-center aspect-[4/3] overflow-hidden">
              <div className="w-full h-full bg-background/70 rounded-2xl border border-borderHalus flex flex-col items-center justify-center p-4 relative group">
                <div className="w-32 h-32 bg-black/5 border-4 border-dashed border-black/40 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-4 w-full h-full">
                    <div className="bg-black/20 border border-white" />
                    <div className="bg-black/40 border border-white" />
                    <div className="bg-black/10 border border-white" />
                    <div className="bg-black/60 border border-white" />
                    <div className="bg-black/5 border border-white" />
                    <div className="bg-black/50 border border-white" />
                    <div className="bg-black/30 border border-white" />
                    <div className="bg-black/20 border border-white" />
                    <div className="bg-black/40 border border-white" />
                    <div className="bg-black/10 border border-white" />
                    <div className="bg-black/60 border border-white" />
                    <div className="bg-black/5 border border-white" />
                    <div className="bg-black/50 border border-white" />
                    <div className="bg-black/30 border border-white" />
                    <div className="bg-black/20 border border-white" />
                    <div className="bg-black/40 border border-white" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-textLabel tracking-wider uppercase mt-4">
                  NNR Grid Resolution Model
                </span>
              </div>
            </div>
          </div>

          {/* JPEG Quality Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-6 md:order-2 flex flex-col justify-center text-left">
              <span className="text-xs font-mono font-bold text-black uppercase tracking-widest mb-3">
                JPEG Quality Q=30
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-black mb-4 leading-snug">
                Memotong detail berfrekuensi tinggi dengan matematika DCT.
              </h3>
              <p className="text-textSec text-sm sm:text-base leading-relaxed font-light">
                JPEG membagi citra menjadi blok $8 \times 8$ piksel dan menerapkan Discrete Cosine Transform (DCT) untuk membuang komponen frekuensi tinggi (detail yang tidak tertangkap mata manusia). Proses lossy ini mengecilkan ukuran data murni (JPEG buffer). Namun, artefak kompresinya memicu noise piksel yang sulit dikompresi oleh wadah PNG lossless.
              </p>
            </div>
            <div className="md:col-span-6 md:order-1 bg-white p-6 rounded-3xl border border-borderHalus shadow-sm flex items-center justify-center aspect-[4/3] overflow-hidden">
              <div className="w-full h-full bg-background/70 rounded-2xl border border-borderHalus flex flex-col items-center justify-center p-4 relative">
                <div className="w-32 h-32 rounded bg-surface flex flex-wrap border-2 border-black/40 shadow-inner overflow-hidden">
                  <div className="w-full h-1/2 bg-gradient-to-r from-black/5 to-black/30 relative">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-40">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className="border border-black/10" />
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-1/2 bg-gradient-to-r from-black/30 to-black/5 relative">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-40">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className="border border-black/10" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-textLabel tracking-wider uppercase mt-4">
                  Discrete Cosine Transform (DCT) Blocks
                </span>
              </div>
            </div>
          </div>

          {/* SVD Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="md:col-span-6 flex flex-col justify-center text-left">
              <span className="text-xs font-mono font-bold text-black uppercase tracking-widest mb-3">
                Singular Value Decomposition
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-black mb-4 leading-snug">
                Melakukan rekonstruksi citra melalui rank matriks terpenting.
              </h3>
              <p className="text-textSec text-sm sm:text-base leading-relaxed font-light">
                SVD memecah matriks piksel citra menjadi komponen eigen $U$, $S$, dan $V^T$. Dengan hanya mempertahankan nilai singular teratas ($k$ komponen terbesar), gambar direkonstruksi dengan tetap menjaga garis struktur terpenting dan membuang detail acak (menghasilkan efek blur/buram).
              </p>
            </div>
            <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-borderHalus shadow-sm flex items-center justify-center aspect-[4/3] overflow-hidden">
              <div className="w-full h-full bg-background/70 rounded-2xl border border-borderHalus flex flex-col items-center justify-center p-4 relative">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-16 bg-black/5 border border-black/40 text-center flex items-center justify-center font-mono text-xs font-bold rounded">U</div>
                  <div className="text-textSec font-bold">×</div>
                  <div className="w-10 h-10 bg-black/15 border border-black/40 text-center flex items-center justify-center font-mono text-xs font-bold rounded-full">S</div>
                  <div className="text-textSec font-bold">×</div>
                  <div className="w-16 h-10 bg-black/5 border border-black/40 text-center flex items-center justify-center font-mono text-xs font-bold rounded">Vᵀ</div>
                </div>
                <span className="text-[10px] font-mono text-textLabel tracking-wider uppercase mt-4">
                  SVD Matrix Factorization (Rank-k)
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FAQ Section (Full Screen Width) */}
      <section className="w-full py-24 bg-white border-b border-borderHalus transition-colors duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 text-left">
            <span className="text-xs font-mono font-bold text-black uppercase tracking-widest bg-brandSecondary py-1.5 px-3 rounded-md w-fit mb-4 block">
              PERTANYAAN UMUM
            </span>
            <h3 className="font-display text-3xl font-extrabold text-black mb-4">
              Ada pertanyaan?
            </h3>
            <p className="text-textLabel text-sm leading-relaxed font-light">
              Berikut adalah beberapa jawaban atas keraguan teknis Anda mengenai kompresi citra dan kontainer format.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-borderHalus/60 rounded-2xl overflow-hidden bg-[#F9F9F9]/80 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base text-black hover:bg-background/40 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-borderHalus/30 text-textSec text-xs sm:text-sm leading-relaxed font-light bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Bottom CTA Banner (Full Screen Width) */}
      <section className="w-full py-24 bg-black text-white text-center relative overflow-hidden">
        {/* Background Dot pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Siap melakukan pengujian kompresi?
          </h3>
          <p className="text-textSec text-sm sm:text-base mb-10 max-w-lg font-light leading-relaxed">
            Buka aplikasi compression sandbox dan lakukan visualisasi perbandingan citra secara sisi-ke-sisi sekarang.
          </p>

          <button
            onClick={onStartCompression}
            className="px-8 py-4 rounded-full bg-brandPrimary text-black font-bold text-base hover:bg-white hover:text-black transition-all duration-300 shadow-xl cursor-pointer flex items-center gap-2 border-2 border-transparent hover:border-white"
          >
            <span>Mulai Pengetesan</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}
