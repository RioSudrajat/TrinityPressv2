# TrinityPress — Product Requirements Document

**Versi:** 1.0.0  
**Tanggal:** Juni 2026  
**Status:** Draft  
**Author:** Tim Produk TrinityPress

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Latar Belakang & Motivasi](#2-latar-belakang--motivasi)
3. [Ruang Lingkup](#3-ruang-lingkup)
4. [Target Pengguna](#4-target-pengguna)
5. [Tujuan & Metrik Keberhasilan](#5-tujuan--metrik-keberhasilan)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Fitur & Functional Requirements](#7-fitur--functional-requirements)
8. [Algoritma Kompresi](#8-algoritma-kompresi)
9. [System Design & UI/UX](#9-system-design--uiux)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Tech Stack](#11-tech-stack)
12. [API Contract](#12-api-contract)
13. [Struktur Proyek](#13-struktur-proyek)
14. [Rencana Pengujian](#14-rencana-pengujian)
15. [Risiko & Mitigasi](#15-risiko--mitigasi)
16. [Milestone & Timeline](#16-milestone--timeline)
17. [Open Questions](#17-open-questions)

---

## 1. Ringkasan Produk

**TrinityPress** adalah aplikasi kompresi gambar berbasis web yang memungkinkan pengguna mengunggah file gambar (PNG, JPEG, WEBP, BMP) dan membandingkan hasilnya menggunakan tiga algoritma kompresi yang berbeda secara side-by-side dalam satu antarmuka.

Nama "Trinity" mencerminkan inti dari produk ini: tiga pendekatan kompresi yang berdiri berdampingan, masing-masing dengan karakternya sendiri. Pengguna bisa melihat langsung trade-off antara kecepatan, kualitas visual, dan efisiensi kompresi — bukan hanya membaca angka, tapi benar-benar melihatnya.

Output seluruh kompresi adalah format **PNG**.

---

## 2. Latar Belakang & Motivasi

### Mengapa ini perlu dibuat?

Sebagian besar tool kompresi gambar yang ada hanya menawarkan satu metode kompresi dengan slider kualitas. Pengguna tidak punya gambaran konkret tentang apa yang sebenarnya terjadi di balik proses kompresi, dan mereka tidak bisa membandingkan secara langsung.

TrinityPress hadir sebagai **studi komparasi visual interaktif** — bukan hanya alat, tapi juga sarana belajar. Seseorang yang baru belajar pemrosesan citra bisa memahami perbedaan antara resampling, chroma subsampling, dan SVD hanya dengan mengunggah satu foto.

### Konteks Akademik

Proyek ini juga dirancang untuk konteks studi komparasi algoritma kompresi yang mensyaratkan:

- Minimum 10 file gambar sebagai bahan uji
- Tiga algoritma kompresi yang berbeda secara metodologi
- Visualisasi perbandingan sebelum/sesudah
- Metrik kuantitatif (ukuran file, persentase kompresi)

---

## 3. Ruang Lingkup

### Dalam Ruang Lingkup (In Scope)

- Upload gambar via drag-and-drop atau file picker
- Dukungan input: PNG, JPEG, WEBP, BMP
- Output kompresi: PNG
- Tiga algoritma: Nearest-Neighbor Resampling, Chroma Subsampling (YUV 4:2:0), SVD
- Perbandingan side-by-side hasil tiga algoritma
- Tampilan ukuran file sebelum dan sesudah kompresi
- Persentase pengurangan ukuran per algoritma
- Download hasil kompresi per algoritma
- Batch upload hingga 10 gambar sekaligus
- Backend Flask (Python), Frontend React

### Di Luar Ruang Lingkup (Out of Scope)

- Kompresi video
- Output format selain PNG
- Penyimpanan gambar di server (semua file bersifat sementara)
- Autentikasi pengguna
- Histori kompresi
- Preview animasi kompresi real-time

---

## 4. Target Pengguna

### Persona Utama: Mahasiswa Teknik / Informatika

**Rizki, 21 tahun, Mahasiswa Teknik Informatika**

Rizki sedang mengerjakan tugas akhir semester tentang kompresi citra digital. Dia perlu menunjukkan perbedaan efek tiga algoritma pada gambar yang sama. Selama ini dia harus nulis script Python, run satu per satu, lalu bandingkan manual. Dengan TrinityPress, dia bisa upload gambarnya dan langsung lihat hasilnya dalam satu layar.

### Persona Sekunder: Developer / Data Engineer

**Tara, 28 tahun, Backend Developer**

Tara sering perlu mengoptimalkan ukuran gambar sebelum dimasukkan ke CDN. Dia paham teknis, tapi ingin cara cepat untuk eksperimen: "kalau aku kompres dengan SVD rank-50, berapa pengurangannya? Masih acceptable secara visual?"

### Persona Tersier: Desainer / Kreator Konten

**Dani, 25 tahun, Fotografer Freelance**

Dani tidak terlalu paham algoritma, tapi ingin tahu versi mana yang paling "aman" dipakai untuk kompresi foto klien. Dia butuh tampilan yang jelas dan tidak bikin bingung.

---

## 5. Tujuan & Metrik Keberhasilan

### Tujuan Produk

| No | Tujuan | Cara Ukur |
|----|--------|-----------|
| T1 | Pengguna dapat membandingkan 3 algoritma dalam satu sesi | Rasio pengguna yang melihat ketiga hasil sebelum keluar ≥ 80% |
| T2 | Proses kompresi selesai dalam waktu wajar | Waktu kompresi per gambar < 10 detik (untuk gambar ≤ 5MB) |
| T3 | Hasil kompresi dapat di-download | Download berhasil tanpa error ≥ 99% |
| T4 | Tampilan informatif dan mudah dipahami | Pengguna baru bisa membaca perbandingan tanpa penjelasan tambahan |

### Definisi Selesai (Definition of Done)

- Semua tiga algoritma menghasilkan file PNG yang valid
- Ukuran file ditampilkan dalam KB/MB (bukan bytes mentah)
- Persentase kompresi dihitung dengan benar: `((original - compressed) / original) × 100`
- Gambar preview tampil dengan benar di semua browser modern (Chrome, Firefox, Safari, Edge)
- Aplikasi berjalan di localhost tanpa error

---

## 6. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  React Frontend                     │   │
│   │                                                     │   │
│   │   UploadZone → ImagePreview → CompressionPanel      │   │
│   │                                                     │   │
│   │   [Drag & Drop]   [Before/After Cards]   [Stats]    │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │ HTTP (multipart/form-data)        │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Flask Backend (Python)                    │
│                                                             │
│   ┌──────────┐    ┌──────────────────────────────────────┐  │
│   │  Routes  │───▶│         Compression Engine           │  │
│   │          │    │                                      │  │
│   │ /upload  │    │  ┌──────────┐  ┌──────────────────┐  │  │
│   │ /compress│    │  │ Nearest  │  │    Chroma Sub    │  │  │
│   │ /download│    │  │Neighbor  │  │  (YUV 4:2:0)     │  │  │
│   │          │    │  │Resampling│  │                  │  │  │
│   └──────────┘    │  └──────────┘  └──────────────────┘  │  │
│                   │        ┌────────────────────────┐     │  │
│                   │        │  SVD Decomposition     │     │  │
│                   │        │  (numpy/scipy)         │     │  │
│                   │        └────────────────────────┘     │  │
│                   └──────────────────────────────────────┘  │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              Temp File Manager                       │  │
│   │   /tmp/trinitypress/{session_id}/                    │  │
│   │     original.png  nn.png  chroma.png  svd.png        │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Alur Data

```
1. User upload gambar
        │
        ▼
2. Flask menerima file, validasi tipe & ukuran
        │
        ▼
3. Konversi ke format internal (PIL Image / NumPy array)
        │
        ├──────────────────────────────────────────┐
        │                    │                     │
        ▼                    ▼                     ▼
4a. NN Resampling    4b. Chroma Sub         4c. SVD Compress
        │                    │                     │
        ▼                    ▼                     ▼
5. Simpan sebagai PNG ke folder /tmp/session_id/
        │
        ▼
6. Return JSON: {original_size, results: [{algo, size, reduction, url}]}
        │
        ▼
7. React render preview + stats card per algoritma
        │
        ▼
8. User klik download → Flask serve file dari /tmp
        │
        ▼
9. Cleanup /tmp/session_id/ setelah 30 menit (background job)
```

---

## 7. Fitur & Functional Requirements

### FR-01: Upload Gambar

**Deskripsi:** Pengguna dapat mengunggah satu atau lebih file gambar untuk diproses.

**Detail:**
- Metode input: drag-and-drop ke zona upload, atau klik untuk membuka file picker
- Format yang diterima: `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`
- Ukuran maksimum per file: **10 MB**
- Jumlah file per sesi: **1–10 file**
- Validasi tipe file dilakukan di sisi client (MIME type) dan server (magic bytes)
- Jika file tidak valid, tampilkan pesan error spesifik: "Format tidak didukung" atau "File terlalu besar (maks 10 MB)"

**Acceptance Criteria:**
- [ ] File berhasil di-upload dan preview tampil dalam 2 detik
- [ ] File dengan format tidak valid ditolak dengan pesan yang jelas
- [ ] File > 10 MB ditolak sebelum di-upload (validasi client-side)
- [ ] Bisa upload lebih dari satu file sekaligus (hingga 10)

---

### FR-02: Proses Kompresi

**Deskripsi:** Backend memproses setiap gambar menggunakan ketiga algoritma secara paralel.

**Detail:**
- Ketiga algoritma berjalan secara paralel menggunakan Python `concurrent.futures`
- Parameter kompresi yang bisa dikonfigurasi user:
  - Nearest-Neighbor: **scale factor** (0.1 – 0.9, default 0.5)
  - Chroma Subsampling: tidak ada parameter tambahan (fixed YUV 4:2:0)
  - SVD: **rank** (1 – 200, default 50)
- Output selalu dalam format PNG

**Acceptance Criteria:**
- [ ] Tiga file PNG berhasil dihasilkan per gambar input
- [ ] Setiap file PNG valid (bisa dibuka di image viewer apapun)
- [ ] Proses selesai < 10 detik untuk gambar ≤ 5 MP resolusi

---

### FR-03: Tampilan Perbandingan

**Deskripsi:** Hasil kompresi ditampilkan bersama gambar asli untuk perbandingan langsung.

**Detail:**
- Layout: 4 kartu berdampingan (1 asli + 3 algoritma) pada layar lebar
- Pada mobile: scroll horizontal atau tampilan akordion
- Setiap kartu menampilkan:
  - Preview gambar (thumbnail atau full preview saat di-klik/zoom)
  - Nama algoritma
  - Ukuran file (format human-readable: KB / MB)
  - Resolusi gambar (lebar × tinggi px)
  - Persentase pengurangan ukuran (berwarna hijau jika > 0%, merah jika ada kenaikan)
  - Tombol "Download" per algoritma

**Acceptance Criteria:**
- [ ] Semua 4 gambar tampil dengan benar
- [ ] Angka ukuran file dan persentase akurat
- [ ] Klik gambar membuka preview full-size (lightbox)
- [ ] Tombol download berfungsi dan file yang diunduh valid

---

### FR-04: Batch Mode (Multi-file)

**Deskripsi:** Pengguna dapat mengupload beberapa gambar dan melihat ringkasan perbandingan.

**Detail:**
- Tampilan daftar gambar yang di-upload (thumbnail strip)
- Klik thumbnail untuk beralih ke gambar yang ingin dilihat perbandingannya
- Tombol "Proses Semua" untuk menjalankan kompresi pada semua file sekaligus
- Progress indicator saat batch processing

**Acceptance Criteria:**
- [ ] Semua gambar dalam batch diproses
- [ ] User bisa navigasi antar gambar tanpa kehilangan hasil yang sudah diproses
- [ ] Progress bar menunjukkan berapa file yang sudah selesai

---

### FR-05: Parameter Tuning

**Deskripsi:** Pengguna dapat mengubah parameter kompresi sebelum atau sesudah proses awal.

**Detail:**
- Panel "Pengaturan Kompresi" dengan slider atau input angka
- Perubahan parameter memicu re-kompresi otomatis (dengan debounce 500ms)
- Tombol "Reset ke Default" untuk mengembalikan nilai awal

**Acceptance Criteria:**
- [ ] Perubahan parameter menghasilkan output yang berbeda
- [ ] Re-kompresi berjalan dalam < 10 detik
- [ ] Nilai parameter divalidasi (tidak bisa input di luar range)

---

### FR-06: Download Hasil

**Deskripsi:** Pengguna dapat mengunduh hasil kompresi.

**Detail:**
- Download per algoritma: tombol di setiap kartu hasil
- Download semua sekaligus: tombol "Unduh Semua (ZIP)" yang menggabungkan 3 file PNG dalam satu arsip ZIP
- Nama file download: `{nama_file_asli}_{algoritma}.png`
  - Contoh: `foto_pantai_nearest_neighbor.png`, `foto_pantai_chroma.png`, `foto_pantai_svd_50.png`

**Acceptance Criteria:**
- [ ] File yang diunduh bisa dibuka dan valid
- [ ] Nama file sesuai konvensi
- [ ] ZIP berisi ketiga file dengan nama yang benar

---

## 8. Algoritma Kompresi

### 8.1 Nearest-Neighbor Resampling (Pixelation)

**Konsep:**
Downscale gambar menggunakan metode nearest-neighbor (mengambil nilai piksel terdekat tanpa interpolasi), lalu upscale kembali ke ukuran semula. Efeknya adalah gambar terlihat "kotak-kotak" (pixelated) — piksel asli digantikan oleh blok warna tunggal.

**Parameter:**
- `scale_factor` (float, 0.1–0.9): Faktor skala downscale sebelum upscale. Nilai kecil = lebih banyak pixelasi = lebih kecil (sebelum upscale), tapi ukuran output PNG bisa lebih kecil karena lebih sedikit variasi warna.

**Implementasi Python:**
```python
from PIL import Image

def nearest_neighbor_compress(image: Image.Image, scale_factor: float = 0.5) -> Image.Image:
    original_size = image.size
    # Downscale dengan nearest-neighbor
    small_w = max(1, int(original_size[0] * scale_factor))
    small_h = max(1, int(original_size[1] * scale_factor))
    downscaled = image.resize((small_w, small_h), Image.NEAREST)
    # Upscale kembali ke ukuran asli
    result = downscaled.resize(original_size, Image.NEAREST)
    return result
```

**Karakteristik Output:**
- Ukuran file PNG lebih kecil karena area warna seragam lebih mudah dikompres PNG
- Kualitas visual menurun secara kasar (pikselasi)
- Cocok untuk demonstrasi efek kompresi yang paling "terlihat"

---

### 8.2 Chroma Subsampling — YUV 4:2:0

**Konsep:**
Mata manusia lebih sensitif terhadap luminance (kecerahan) daripada chrominance (warna). YUV 4:2:0 memanfaatkan ini dengan menyimpan informasi warna (U dan V channel) pada resolusi setengah dari luminance (Y channel) secara horizontal dan vertikal.

**Parameter:**
- Tidak ada parameter yang dapat diubah pengguna (fixed YUV 4:2:0 subsampling)

**Implementasi Python:**
```python
import numpy as np
from PIL import Image

def chroma_subsampling_compress(image: Image.Image) -> Image.Image:
    # Konversi ke YCbCr
    ycbcr = image.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    
    # Subsample Cb dan Cr ke 1/2 resolusi (4:2:0)
    w, h = y.size
    cb_small = cb.resize((w // 2, h // 2), Image.LANCZOS)
    cr_small = cr.resize((w // 2, h // 2), Image.LANCZOS)
    
    # Upsample kembali ke resolusi asli
    cb_up = cb_small.resize((w, h), Image.LANCZOS)
    cr_up = cr_small.resize((w, h), Image.LANCZOS)
    
    # Gabungkan kembali
    merged = Image.merge("YCbCr", (y, cb_up, cr_up))
    return merged.convert("RGB")
```

**Karakteristik Output:**
- Kualitas visual relatif terjaga (kehilangan warna tidak terlalu terasa)
- Kompresi PNG-nya sedang (tidak sedramatis NN)
- Metode ini yang digunakan JPEG secara internal

---

### 8.3 Singular Value Decomposition (SVD)

**Konsep:**
Setiap channel warna (R, G, B) dari gambar diperlakukan sebagai matriks. SVD memfaktorkan matriks tersebut menjadi tiga matriks (U, Σ, Vᵀ). Dengan menyimpan hanya k nilai singular terbesar (low-rank approximation), gambar bisa direkonstruksi dengan detail yang lebih sedikit.

**Parameter:**
- `rank` (int, 1–200): Jumlah singular values yang dipertahankan. Nilai kecil = lebih banyak kehilangan detail = lebih terkompresi.

**Implementasi Python:**
```python
import numpy as np
from PIL import Image

def svd_compress(image: Image.Image, rank: int = 50) -> Image.Image:
    img_array = np.array(image, dtype=np.float64)
    channels = []
    
    for i in range(3):  # R, G, B
        channel = img_array[:, :, i]
        U, S, Vt = np.linalg.svd(channel, full_matrices=False)
        
        # Low-rank approximation
        k = min(rank, len(S))
        compressed = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
        compressed = np.clip(compressed, 0, 255)
        channels.append(compressed)
    
    result_array = np.stack(channels, axis=2).astype(np.uint8)
    return Image.fromarray(result_array)
```

**Karakteristik Output:**
- Efek visual seperti foto yang "blur" secara matematis
- Semakin kecil rank, semakin abstrak gambarnya
- Kompresi yang paling "serius" secara matematis — cocok untuk penjelasan konsep linear algebra

---

### 8.4 Tabel Perbandingan Algoritma

| Aspek | Nearest-Neighbor | Chroma Subsampling | SVD |
|-------|------------------|--------------------|-----|
| Kategori | Spatial Resampling | Color Space Reduction | Matrix Factorization |
| Kualitas Visual | Blok/Piksel | Hampir tidak terlihat | Blur/Halus |
| Kecepatan | Sangat cepat | Cepat | Lambat (O(n³)) |
| Parameter | Scale Factor | - | Rank |
| Basis Matematis | Sampling theory | Human perception | Linear Algebra |

---

## 9. System Design & UI/UX

### 9.1 Filosofi Desain TrinityPress

TrinityPress dirancang dengan satu kata kunci: **kejujuran visual**. Alat ini tidak menyembunyikan efek kompresi — justru memperlihatkannya dengan terang. Desainnya mengikuti filosofi ini: tidak ada efek kilauan atau animasi yang berlebihan, yang ada adalah keterbacaan, kontras yang jelas, dan informasi yang langsung ke intinya.

---

### 9.2 Design Tokens

#### Warna

```
Background utama:     #0F1117  (hampir hitam, slate gelap)
Surface card:         #1C1F2A  (dark navy)
Surface elevated:     #252836  (sedikit lebih terang untuk hover)
Border halus:         #2E3347  (garis pembatas card)

Accent utama:         #5B8CFF  (biru elektrik — "presisi")
Accent sekunder:      #A78BFA  (ungu lavender — "matematis")
Accent tersier:       #34D399  (hijau mint — "sukses/efisien")

Teks utama:          #F0F2FF  (putih susu, tidak pure white)
Teks sekunder:       #8B90A8  (abu-abu medium)
Teks label:          #5A6070  (abu gelap untuk metadata)

Error:               #F87171   (merah pastel)
Warning:             #FBBF24   (kuning amber)
```

#### Tipografi

```
Display face:   "Space Grotesk" — geometric sans, karakter yang distinctive
                dipakai untuk nama algoritma, judul section, angka besar

Body face:      "Inter" — familiar, readable, tidak menarik perhatian ke dirinya sendiri
                dipakai untuk paragraf, label, deskripsi

Mono face:      "JetBrains Mono" — untuk angka teknis (ukuran file, persentase)
                mono ensures angka tidak melompat-lompat saat update

Scale:
- xs:  11px / leading 1.4
- sm:  13px / leading 1.5
- md:  15px / leading 1.6  (body default)
- lg:  18px / leading 1.5
- xl:  24px / leading 1.3
- 2xl: 32px / leading 1.2
- 3xl: 48px / leading 1.1  (display only)
```

#### Spacing

```
Satuan dasar: 4px
xs: 4px   | sm: 8px  | md: 12px  | lg: 16px
xl: 24px  | 2xl: 32px | 3xl: 48px | 4xl: 64px
```

#### Border Radius

```
sm: 4px    (input, badge kecil)
md: 8px    (card, button)
lg: 12px   (panel besar)
xl: 16px   (modal, dialog)
pill: 999px (tag, chip)
```

---

### 9.3 Struktur Halaman & Layout

#### Halaman Utama — State: Empty (Belum Upload)

```
┌─────────────────────────────────────────────────────────────┐
│  ▲ TrinityPress                    [?] Tentang              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     Tiga cara menekan satu gambar.                          │
│     Lihat sendiri bedanya.                                  │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │          ⬆  Seret gambar ke sini                   │   │
│   │                                                     │   │
│   │     atau  [Pilih file dari komputer]                │   │
│   │                                                     │   │
│   │     PNG · JPEG · WEBP · BMP  ·  Maks 10 MB         │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ── Cara Kerjanya ──                                       │
│                                                             │
│   [NN Resampling]  [Chroma Sub]  [SVD]                      │
│   Deskripsi singkat per algoritma (1–2 kalimat)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Halaman Utama — State: Sedang Memproses

```
┌─────────────────────────────────────────────────────────────┐
│  ▲ TrinityPress                    [Upload Lagi]            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   foto_pemandangan.jpg · 3.2 MB · 4032 × 3024 px           │
│                                                             │
│   ┌────────────────────────────────────────────────────┐    │
│   │ ████████████████████░░░░░  67%                     │    │
│   │ Menjalankan SVD rank-50...                         │    │
│   └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Halaman Utama — State: Hasil Siap

```
┌─────────────────────────────────────────────────────────────┐
│  ▲ TrinityPress              [Upload Baru]  [Unduh Semua ↓] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   foto_pemandangan.jpg                                      │
│   [Parameter] Scale: 0.5 ──●────  Rank: ───●── 50          │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │  ORIGINAL  │  │  NEAREST   │  │  CHROMA    │  │  SVD   ││
│  │            │  │ NEIGHBOR   │  │  4:2:0     │  │        ││
│  │  [gambar]  │  │  [gambar]  │  │  [gambar]  │  │[gambar]││
│  │            │  │            │  │            │  │        ││
│  │  3.2 MB    │  │  842 KB    │  │  1.1 MB    │  │ 620 KB ││
│  │  4032×3024 │  │  4032×3024 │  │  4032×3024 │  │4032×302││
│  │            │  │  ↓ 73.7%   │  │  ↓ 65.6%   │  │↓ 80.6% ││
│  │            │  │ [↓ Unduh]  │  │ [↓ Unduh]  │  │[↓Unduh]││
│  └────────────┘  └────────────┘  └────────────┘  └────────┘│
│                                                             │
│  ── Ringkasan Perbandingan ──                               │
│                                                             │
│  Algoritma          Ukuran    Pengurangan    Kecepatan      │
│  ──────────         ──────    ───────────    ─────────      │
│  Nearest-Neighbor   842 KB    73.7%          0.12 detik     │
│  Chroma Sub         1.1 MB    65.6%          0.08 detik     │
│  SVD (rank=50)      620 KB    80.6%          4.3 detik      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 9.4 Signature Element Desain

**Elemen signature TrinityPress: Label algoritma sebagai "band" vertikal di sisi kiri setiap kartu.**

Alih-alih header horizontal biasa, setiap kartu hasil memiliki strip vertikal tipis (8px) di sisi kiri dengan warna unik per algoritma:
- Nearest-Neighbor: `#5B8CFF` (biru)
- Chroma Sub: `#A78BFA` (ungu)
- SVD: `#34D399` (hijau)

Strip ini terlihat di seluruh antarmuka: di thumbnail batch list, di summary table, dan di kartu hasil. Pengguna akhirnya mengenali algoritma lewat warna, bukan hanya nama.

---

### 9.5 Komponen UI

#### Card Algoritma
```
┌─┬──────────────────────────────────────────┐
│ │  NEAREST-NEIGHBOR RESAMPLING             │
│█│                                          │
│ │  [preview gambar]                        │
│ │                                          │
│ │  842 KB  ·  4032 × 3024                  │
│ │  ↓ 73.7% lebih kecil                    │
│ │                                          │
│ │  [↓ Unduh PNG]                           │
└─┴──────────────────────────────────────────┘
```
Kiri: Strip warna 8px tinggi penuh  
Kanan: Konten kartu  

#### Upload Zone
- Default: dashed border, icon upload, teks panduan
- Drag-over: border solid accent + background subtle tint
- Processing: border animasi pulse + progress bar

#### Summary Table
- Tabel sederhana, font mono untuk angka
- Baris dengan nilai pengurangan terbesar di-highlight dengan bold
- Kolom kecepatan menampilkan waktu dalam milidetik atau detik

---

### 9.6 States & Error Handling

| Kondisi | Tampilan |
|---------|----------|
| Upload gagal (format) | Toast error merah, pesan spesifik format |
| Upload gagal (ukuran) | Toast error merah, sebutkan batas 10 MB |
| Proses gagal (backend) | Kartu error dengan pesan "Gagal memproses" + tombol Coba Lagi |
| File kosong / corrupt | "File tidak dapat dibaca — coba file lain" |
| Server tidak tersedia | Banner error di atas halaman |
| Timeout (> 60 detik) | Pesan timeout + tombol Coba Lagi |

---

## 10. Non-Functional Requirements

### Performa
- Waktu load halaman awal: < 2 detik
- Waktu kompresi per gambar (≤ 5 MP): < 10 detik
- Kompresi berjalan paralel untuk ketiga algoritma (bukan sekuensial)

### Keamanan
- Validasi tipe file di sisi server menggunakan magic bytes (bukan hanya ekstensi)
- Ukuran maksimum request body dibatasi (10 MB)
- File disimpan di `/tmp` dengan nama random (UUID), bukan nama asli
- File dihapus otomatis setelah 30 menit atau setelah session berakhir
- Tidak ada file upload yang persisten di server

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Aksesibilitas
- Semua gambar memiliki alt text deskriptif
- Tombol memiliki label ARIA
- Kontras warna sesuai WCAG AA (4.5:1 untuk teks normal)
- Navigasi keyboard berfungsi untuk semua aksi utama

---

## 11. Tech Stack

### Backend

| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Framework | Flask 3.x | Ringan, Python-native, mudah integrasi dengan library image |
| Image Processing | Pillow (PIL) | Standard library untuk image manipulation di Python |
| Matriks & SVD | NumPy + SciPy | `np.linalg.svd` untuk SVD, array operations untuk Chroma Sub |
| Paralelisme | `concurrent.futures` | Thread pool untuk jalankan 3 algoritma serentak |
| ZIP | `zipfile` (stdlib) | Buat ZIP untuk download semua hasil |
| CORS | Flask-CORS | Allow request dari React dev server |
| Session | UUID + in-memory dict | Mapping session ke folder /tmp |

### Frontend

| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Framework | React 18 | Komponen reusable, state management yang mature |
| Build Tool | Vite | Fast dev server, HMR instan |
| Styling | Tailwind CSS + CSS Modules | Utility-first untuk speed, Modules untuk komponen kompleks |
| HTTP Client | Axios | Interceptor untuk error handling, progress upload |
| Drag & Drop | react-dropzone | Battle-tested, aksesibel |
| UI Components | Radix UI Primitives | Aksesibel, un-styled, custom-styleable |
| Fonts | Google Fonts | Space Grotesk, Inter, JetBrains Mono |
| Icons | Lucide React | Konsisten, ringan |

### Development

```
Node.js 20+
Python 3.11+
pip (dengan virtualenv)
```

---

## 12. API Contract

### Base URL
```
http://localhost:5000/api
```

---

### POST /compress

Upload dan kompres satu gambar dengan ketiga algoritma.

**Request:**
```
Content-Type: multipart/form-data

file:          (binary) — file gambar
scale_factor:  (float, optional) — default 0.5, range 0.1–0.9
svd_rank:      (int, optional) — default 50, range 1–200
```

**Response 200:**
```json
{
  "session_id": "a3f7b2c1-9e4d-4f8a-b1c2-d3e4f5a6b7c8",
  "original": {
    "filename": "foto_pantai.jpg",
    "size_bytes": 3355648,
    "size_human": "3.2 MB",
    "width": 4032,
    "height": 3024,
    "url": "/api/download/a3f7b2c1.../original.png"
  },
  "results": [
    {
      "algorithm": "nearest_neighbor",
      "label": "Nearest-Neighbor Resampling",
      "size_bytes": 862208,
      "size_human": "842 KB",
      "width": 4032,
      "height": 3024,
      "reduction_percent": 74.31,
      "duration_ms": 124,
      "url": "/api/download/a3f7b2c1.../nearest_neighbor.png",
      "params": { "scale_factor": 0.5 }
    },
    {
      "algorithm": "chroma_subsampling",
      "label": "Chroma Subsampling (YUV 4:2:0)",
      "size_bytes": 1126400,
      "size_human": "1.1 MB",
      "width": 4032,
      "height": 3024,
      "reduction_percent": 66.44,
      "duration_ms": 89,
      "url": "/api/download/a3f7b2c1.../chroma_subsampling.png",
      "params": {}
    },
    {
      "algorithm": "svd",
      "label": "SVD (rank=50)",
      "size_bytes": 634880,
      "size_human": "620 KB",
      "width": 4032,
      "height": 3024,
      "reduction_percent": 81.09,
      "duration_ms": 4321,
      "url": "/api/download/a3f7b2c1.../svd.png",
      "params": { "rank": 50 }
    }
  ]
}
```

**Response 400:**
```json
{
  "error": "invalid_file_type",
  "message": "Format file tidak didukung. Gunakan PNG, JPEG, WEBP, atau BMP."
}
```

**Response 413:**
```json
{
  "error": "file_too_large",
  "message": "Ukuran file melebihi batas 10 MB."
}
```

---

### GET /download/{session_id}/{filename}

Download file hasil kompresi.

**Response 200:** File binary (image/png)  
**Response 404:** Session atau file tidak ditemukan  

---

### GET /download/{session_id}/all.zip

Download semua hasil kompresi dalam satu file ZIP.

**Response 200:** File binary (application/zip)  

---

### GET /health

Health check endpoint untuk verifikasi backend aktif.

**Response 200:**
```json
{ "status": "ok", "version": "1.0.0" }
```

---

## 13. Struktur Proyek

```
trinitypress/
│
├── backend/
│   ├── app.py                  # Flask app factory & routes
│   ├── config.py               # Konfigurasi (MAX_FILE_SIZE, UPLOAD_FOLDER, dll)
│   ├── requirements.txt
│   │
│   ├── compressors/
│   │   ├── __init__.py
│   │   ├── base.py             # Abstract base class Compressor
│   │   ├── nearest_neighbor.py
│   │   ├── chroma_subsampling.py
│   │   └── svd.py
│   │
│   ├── services/
│   │   ├── compression_service.py  # Orchestrate parallel compression
│   │   └── file_service.py         # File save, cleanup, size calculation
│   │
│   ├── utils/
│   │   ├── validators.py       # File type & size validation
│   │   └── formatters.py       # Human-readable size, percentage
│   │
│   └── tests/
│       ├── test_compressors.py
│       ├── test_api.py
│       └── sample_images/      # 10+ gambar uji
│           ├── portrait.jpg
│           ├── landscape.png
│           ├── high_contrast.png
│           ├── low_detail.jpg
│           ├── colorful.webp
│           └── ... (minimal 10 file)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    │
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   │
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Header.jsx
    │   │   │   └── Footer.jsx
    │   │   │
    │   │   ├── upload/
    │   │   │   ├── DropZone.jsx        # Drag & drop area
    │   │   │   ├── FilePreview.jsx     # Thumbnail sebelum proses
    │   │   │   └── BatchList.jsx       # Daftar file di batch mode
    │   │   │
    │   │   ├── compression/
    │   │   │   ├── AlgorithmCard.jsx   # Card per algoritma
    │   │   │   ├── OriginalCard.jsx    # Card gambar asli
    │   │   │   ├── ResultGrid.jsx      # Layout 4 kartu berdampingan
    │   │   │   ├── SummaryTable.jsx    # Tabel ringkasan
    │   │   │   └── ParameterPanel.jsx  # Slider scale & rank
    │   │   │
    │   │   ├── common/
    │   │   │   ├── ProgressBar.jsx
    │   │   │   ├── Toast.jsx
    │   │   │   ├── Lightbox.jsx        # Full-size preview
    │   │   │   └── AlgoInfoModal.jsx   # Penjelasan algoritma
    │   │   │
    │   │   └── icons/
    │   │       └── AlgorithmIcon.jsx
    │   │
    │   ├── hooks/
    │   │   ├── useCompression.js       # State & logic kompresi
    │   │   ├── useFileUpload.js        # Upload handling
    │   │   └── useDownload.js          # Download logic
    │   │
    │   ├── api/
    │   │   └── compression.js          # Axios calls ke Flask
    │   │
    │   ├── utils/
    │   │   ├── formatters.js           # Format ukuran file
    │   │   └── validators.js           # Client-side file validation
    │   │
    │   └── styles/
    │       ├── globals.css             # CSS variables & reset
    │       └── algorithms.css          # Warna per algoritma
    │
    └── public/
        └── favicon.svg
```

---

## 14. Rencana Pengujian

### Unit Tests (Backend)

```python
# test_compressors.py

def test_nearest_neighbor_output_size_equals_input():
    """Output harus punya dimensi yang sama dengan input"""

def test_nearest_neighbor_file_smaller_than_original():
    """File hasil harus lebih kecil dari original (untuk scale < 0.9)"""

def test_chroma_sub_preserves_luminance():
    """Channel Y harus identik sebelum dan sesudah"""

def test_svd_rank_1_most_compressed():
    """Rank 1 harus menghasilkan file paling kecil"""

def test_svd_rank_200_closest_to_original():
    """Rank 200 harus paling mirip dengan original"""

def test_all_outputs_are_valid_png():
    """Semua output bisa dibuka sebagai PNG"""
```

### Integration Tests (API)

```python
# test_api.py

def test_compress_endpoint_returns_three_results():
def test_compress_rejects_invalid_format():
def test_compress_rejects_oversized_file():
def test_download_returns_valid_png():
def test_download_all_zip_contains_three_files():
def test_session_cleanup_after_timeout():
```

### Manual Test Checklist (Frontend)

- [ ] Drag & drop file berhasil
- [ ] File picker berfungsi
- [ ] Preview gambar asli tampil sebelum proses
- [ ] Progress bar bergerak saat kompresi
- [ ] Keempat kartu tampil setelah selesai
- [ ] Angka ukuran file dan persentase benar
- [ ] Download per algoritma berfungsi
- [ ] Download ZIP berfungsi
- [ ] Lightbox preview berfungsi (klik gambar)
- [ ] Slider parameter memicu re-kompresi
- [ ] Error state tampil dengan benar
- [ ] Mobile layout berfungsi (scroll horizontal)

### Sample Images untuk Pengujian (min 10)

| No | Nama File | Tipe | Ukuran | Karakteristik |
|----|-----------|------|--------|---------------|
| 1  | portrait_high_res.jpg | JPEG | ~3 MB | Foto wajah, banyak detail halus |
| 2  | landscape_wide.png | PNG | ~5 MB | Pemandangan alam, gradasi warna |
| 3  | city_night.jpg | JPEG | ~2.5 MB | Kontras tinggi, banyak cahaya |
| 4  | simple_graphic.png | PNG | ~1 MB | Ilustrasi sederhana, area warna flat |
| 5  | texture_wood.jpg | JPEG | ~4 MB | Tekstur repetitif |
| 6  | low_detail.png | PNG | ~500 KB | Gambar minimalis |
| 7  | colorful_abstract.webp | WEBP | ~2 MB | Warna cerah, pola kompleks |
| 8  | black_white.jpg | JPEG | ~1.5 MB | Foto grayscale |
| 9  | document_scan.png | PNG | ~3 MB | Teks di atas background putih |
| 10 | macro_photo.jpg | JPEG | ~6 MB | Detail sangat tinggi, foto makro |

---

## 15. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| SVD terlalu lambat untuk gambar besar | Tinggi | Medium | Batasi dimensi input ke 2000px max sebelum SVD; tampilkan warning |
| Memory overflow saat SVD pada gambar besar | Medium | Tinggi | Resize otomatis sebelum proses, tangkap MemoryError dan return error graceful |
| Browser timeout saat proses SVD | Medium | Medium | Polling endpoint atau SSE untuk progress real-time |
| File tidak terhapus dari /tmp | Rendah | Medium | Background job cleanup setiap 30 menit |
| Nama file dengan karakter spesial | Medium | Rendah | Sanitize filename saat simpan, gunakan UUID sebagai nama internal |
| Chroma Sub menghasilkan file lebih besar dari original | Rendah | Rendah | Documented behavior, tampilkan persentase negatif jika terjadi |

---

## 16. Milestone & Timeline

### Sprint 1 (Hari 1–3): Foundation

- [ ] Setup repo (monorepo trinitypress/)
- [ ] Backend: Flask app + routing dasar
- [ ] Backend: Implementasi ketiga algoritma kompresi
- [ ] Backend: Unit tests untuk semua compressor
- [ ] Frontend: Setup Vite + React + Tailwind
- [ ] Frontend: Komponen DropZone

### Sprint 2 (Hari 4–6): Core Features

- [ ] Backend: Endpoint /compress dengan paralelisme
- [ ] Backend: Endpoint /download dan /download-all
- [ ] Frontend: AlgorithmCard + ResultGrid
- [ ] Frontend: Integrasi API (upload + tampil hasil)
- [ ] Frontend: Progress bar saat kompresi

### Sprint 3 (Hari 7–9): Polish & Testing

- [ ] Frontend: ParameterPanel (slider scale & rank)
- [ ] Frontend: SummaryTable
- [ ] Frontend: Lightbox preview
- [ ] Frontend: Batch mode (multi-file)
- [ ] Error handling end-to-end
- [ ] Manual testing dengan 10+ gambar
- [ ] Fix bugs

### Sprint 4 (Hari 10): Final

- [ ] Styling final (warna, tipografi, responsive)
- [ ] README.md dengan instruksi instalasi
- [ ] Screenshot / demo
- [ ] Cleanup kode

---

## 17. Open Questions

1. **SVD performance limit** — Perlu diputuskan: apakah gambar di-resize otomatis ke max 1500px sebelum SVD, atau user yang diberi warning dan pilihan?

2. **Chroma subsampling — parameter?** — Pertimbangkan apakah perlu tambahkan opsi 4:2:2 sebagai perbandingan di masa depan.

3. **Batch processing order** — Apakah semua file diproses paralel (bisa beban CPU tinggi) atau sekuensial dengan antrian?

4. **Mobile experience** — Layout 4 kartu berdampingan tidak fit di mobile. Perlu diputuskan: scroll horizontal, atau accordion/tab per algoritma?

5. **Nama file download** — Konvensi yang dipilih: `{original_name}_{algo}.png` vs `{algo}_{original_name}.png` — yang mana lebih intuitif?

---

*Dokumen ini adalah living document. Akan diperbarui seiring perkembangan proyek.*

---

**TrinityPress** — Tiga cara. Satu gambar. Kamu yang pilih.