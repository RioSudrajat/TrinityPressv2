# TrinityPress Frontend

Frontend untuk aplikasi kompresi gambar TrinityPress, dibuat menggunakan React 18, Vite, dan Tailwind CSS.

## Fitur Utama

- **Drag & Drop Upload**: Upload multi-file hingga 10 file sekaligus (PNG, JPEG, WEBP, BMP) dengan validasi ukuran (maks 10 MB).
- **Parameter Tuning**: Slider interaktif untuk `scale_factor` (Nearest-Neighbor) dan `svd_rank` (SVD) dengan re-kompresi otomatis (debounced 500ms).
- **Perbandingan Side-by-Side**: Layout grid 4 kartu (Original + 3 Hasil Algoritma) yang responsive (mendukung horizontal scroll di perangkat mobile).
- **Signature Design Element**: Garis vertikal penunjuk algoritma berwarna unik (Biru untuk NN, Lavender untuk Chroma, Mint untuk SVD).
- **Ringkasan Perbandingan**: Tabel analisis data kompresi menggunakan font monospaced dan meng-highlight algoritma dengan efisiensi kompresi tertinggi.
- **Lightbox Zoom**: Pratinjau gambar ukuran penuh dengan tab perpindahan instan untuk membandingkan perbedaan detail piksel.

## Instalasi & Cara Menjalankan

1. Masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal (Vite):
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

4. Pastikan backend Flask berjalan pada `http://localhost:5000` untuk melakukan kompresi gambar secara real-time.

## Struktur Direktori

- `src/components/layout/`: Header dan Footer.
- `src/components/upload/`: Komponen DropZone dan BatchList.
- `src/components/compression/`: Kartu Original/Algoritma, ResultGrid, SummaryTable, dan ParameterPanel.
- `src/components/common/`: Lightbox, Info Modal, ProgressBar, dan Toast.
- `src/api/`: Klien Axios untuk request ke Flask backend.
- `src/utils/`: Formatter ukuran/kecepatan dan validator file.
- `src/styles/`: Global theme token dan style penunjuk algoritma.
