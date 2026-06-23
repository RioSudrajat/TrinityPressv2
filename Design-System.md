Grass.io — Design System Reference

Disusun dari observasi langsung terhadap grass.io (Homepage, Download, Learn, contoh artikel blog) dan halaman resmi grass.io/media-kit yang memuat aset brand resmi mereka.

Legenda sumber data:

✅ Terverifikasi — diambil langsung dari Media Kit resmi atau konten halaman.
💡 Rekomendasi — nilai presisi (radius, shadow, breakpoint, spacing, motion) tidak terekspos di konten publik halaman, jadi disusun sebagai estimasi yang konsisten dengan gaya visual yang teramati. Jangan dianggap sebagai nilai CSS asli yang "dicuri" 1:1 dari source code mereka.

1. Brand Essence

Grass adalah jaringan DePIN (Decentralized Physical Infrastructure Network) — produk yang mengubah bandwidth internet rumahan yang tidak terpakai menjadi reward/token. Dari pesan yang berulang di seluruh situs, ada 4 pilar brand yang konsisten dipegang:

Trust & Transparency — disebut di hampir setiap halaman: badge AMTSO Member, sertifikasi AppEsteem, klaim "regularly audited and constantly monitored", penjelasan privasi berulang.
Empowerment / Ownership — framing "resource yang sudah kamu punya, sekarang bekerja untukmu", "own a part of the network".
Effortless Simplicity — "runs in the background of your life", onboarding 3 langkah (Download → Create account → Earn).
Optimis & manusiawi, bukan "crypto-bro" — palet terang (bukan dark-mode khas Web3), foto manusia asli untuk social proof, copy santai bukan jargon teknis berat.

Tone visual: terang, lapang (banyak whitespace), aksen hijau lime yang energik, tipografi geometris yang ramah — kesan "fintech yang santai", bukan "crypto yang sok serius".

2. Color System ✅

NamaCSS VariableHexRGBPenggunaanPrimary (Grass Green)--color-primary#ABF600171, 246, 0Warna ikonik brand. Tombol primer, highlight, ikon aktif. Pakai sebagai aksen, bukan untuk blok besar atau body text.Secondary (Sprout)--color-secondary#F2FED1242, 254, 209Tint hijau pucat untuk background section lembut, badge sekunder, hover state ringan.Background--color-bg#F3F3F3243, 243, 243Latar belakang default halaman/section (abu sangat terang, bukan putih murni).White--color-white#FFFFFF255, 255, 255Permukaan card, modal, area dengan kontras tertinggi.Text Secondary--color-text-secondary#40404064, 64, 64Body copy, paragraf, teks deskriptif.Black (Ink)--color-black#11111117, 17, 17Heading, teks utama, logo di atas latar terang.

Proporsi warna resmi: 55% / 35% / 10%. Berdasarkan dominasi visual di seluruh halaman, interpretasinya: ±55% netral terang (White/Background) sebagai base, ±35% Black/Text Secondary untuk teks & kontras, ±10% Primary Green sebagai aksen tajam. (Catatan: di Media Kit ini ditampilkan sebagai chart visual tanpa label angka-ke-warna yang eksplisit di teks, jadi pemetaan di atas adalah interpretasi logis, bukan kutipan langsung.)

Aturan kontras (penting):

Primary Green selalu dipasangkan dengan teks gelap (#111111). Teks putih di atas hijau lime kontrasnya hanya ~1.3:1 — gagal total secara aksesibilitas.
Black/Text Secondary di atas White/Background/Secondary memberi kontras ~10:1–19:1 — lolos WCAG AAA dengan mudah.

css:root {
--color-primary: #ABF600;
--color-secondary: #F2FED1;
--color-bg: #F3F3F3;
--color-white: #FFFFFF;
--color-text-secondary: #404040;
--color-black: #111111;
}

3. Typography

Typeface: Karla ✅ — geometric/grotesque sans-serif humanis dengan sudut sedikit membulat, open-source, tersedia gratis di Google Fonts. Karla dipakai di seluruh hierarki (display, body, UI) — tidak ada font pairing dengan typeface kedua.

Weight scale resmi ✅ (tidak ada weight 600/SemiBold di set resmi mereka):

Weight NameValueExtraLight200Light300Regular400Medium500Bold700ExtraBold800

Skala tipografi 💡 (hierarki & pemakaian weight terverifikasi dari konten; angka px adalah estimasi mengikuti proporsi visual yang teramati):

LevelSizeWeightLine-heightContoh pemakaianDisplay / Hero H156–72pxExtraBold 8001.05–1.1"Get rewarded for the internet you don't use"H2 / Statement Heading32–44pxBold 7001.15–1.2Paragraf besar ala-headline (lihat §6.6)H3 / Section Title22–28pxBold 7001.3"Why It Matters", "How to Get Started"Body Large18–20pxRegular 4001.5–1.6Subheadline di bawah heroBody16pxRegular 4001.6Paragraf umum, jawaban FAQCaption / Eyebrow12–13pxMedium 500, uppercase, letter-spacing ~0.05em1.4Label kategori, "USERS" pada stat badgeButton15–16pxBold 7001Semua teks CTA

Pola voice lewat tipografi ✅:

Nama brand "grass" kerap ditulis huruf kecil meski di tengah headline (gaya wordmark lowercase modern à la github/stripe), sementara "Grass" kapital tetap dipakai sebagai kata baku di body copy.
Semua heading pakai sentence case, bukan Title Case — terasa lebih percakapan.
Pola signature: paragraf penjelasan disetel dalam ukuran H2 untuk jadi "pernyataan besar" yang persuasif, bukan caption kecil di bawah judul. Lihat komponen §6.6.

css:root {
--font-family-base: 'Karla', sans-serif;
--fw-extralight: 200;
--fw-light: 300;
--fw-regular: 400;
--fw-medium: 500;
--fw-bold: 700;
--fw-extrabold: 800;

--fs-display: clamp(2.5rem, 5vw, 4.5rem);
--fs-h2: clamp(2rem, 3.5vw, 2.75rem);
--fs-h3: 1.5rem;
--fs-body-lg: 1.25rem;
--fs-body: 1rem;
--fs-caption: 0.8125rem;
}

4. Logo & Identitas Visual ✅

4 varian lockup resmi:

Vertical Logo — logomark di atas, wordmark di bawah
Horizontal Logo — logomark + wordmark sejajar
Logomark — ikon sprout/grass saja
Logo Text — wordmark saja, disertai simbol ™

Lockup hitam dipakai di atas latar terang (header), lockup putih dipakai di atas latar gelap (footer) — situs secara otomatis berganti file logo sesuai kontras background. Penskalaan disediakan resmi dalam rasio 1x–4x untuk logomark & logotext (kebutuhan favicon, app icon, retina display, dll).

6 larangan resmi pada logo:

Jangan tambahkan shadow di belakang logo
Jangan pakai logo dalam resolusi rendah
Jangan stretch/distorsi proporsi logo
Jangan jadikan logo sebagai frame/mask untuk gambar
Jangan tambahkan outline pada logo
Jangan tempatkan logo di atas warna berkontras rendah

Detail unik: Logomark dipakai sebagai animasi loading spinner saat konten halaman "Learn" sedang memuat — logo bukan cuma identitas statis, tapi juga elemen fungsional di UI.

5. Layout, Grid & Spacing

Pola grid yang teramati ✅:

Hero — single column, teks center-aligned, satu CTA, visual pendukung di belakang/bawah teks (bukan split 50/50 kiri-kanan).
Feature section — pola "zig-zag" alternating: gambar di satu sisi, teks (eyebrow + Statement Heading) di sisi lain, arah berselang-seling tiap section ("Why It Matters" lalu "Why People Trust It" berlawanan arah).
Step section — 3 kolom horizontal (collapse jadi stack di mobile). Step pertama mendapat penekanan lebih besar (judul lebih tebal, deskripsi 2 baris, ada tombol CTA); step 2 & 3 lebih ringkas (cuma nomor + judul + deskripsi singkat, tanpa tombol).
FAQ — stacked list dalam container yang lebih sempit dari section lain, demi keterbacaan.
Footer — multi-kolom (brand+social / nav links / badge sertifikasi) yang collapse jadi stack di mobile.

Rekomendasi spacing & breakpoint 💡 (standar industri, menyesuaikan whitespace lapang yang teramati):

css:root {
/_ Spacing scale (4px base) _/
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;

/_ Breakpoints _/
--bp-mobile: 640px;
--bp-tablet: 1024px;
--bp-desktop: 1280px;

/_ Radius — pill untuk button/badge, soft untuk card _/
--radius-pill: 999px;
--radius-card: 20px;
--radius-sm: 12px;

/_ Shadow — dipakai minim/jarang, gaya situs cenderung flat _/
--shadow-soft: 0 8px 24px rgba(17, 17, 17, 0.08);
}

6. Component Library

6.1 Navigation Bar

Sticky di top. Anatomi: [Logo + wordmark] — [nav links: Download, Learn] — [Primary button: "Open Dashboard"]. Sangat minim — hanya 2 link nav utama + 1 CTA, tidak ada mega-menu atau dropdown kompleks.

6.2 Button

Primary — fill Primary Green, teks Black, bentuk pill (border-radius: 999px), bold. Dipakai untuk semua CTA utama: "Download Grass", "Open Dashboard", "Start Now".
Secondary / Text Link — tanpa fill, teks dengan arrow/chevron, untuk CTA sekunder: "Learn More", "Learn More About Points".
Hierarki tombol cuma 2 level (fill vs text-link) — tidak ada pola outline-button terpisah.

6.3 Stat Badge

Angka besar + label kecil uppercase. Contoh: >8,500,000 USERS. Dipakai sebagai social-proof langsung di bawah hero atau di halaman Download.

6.4 Avatar Stack (Social Proof)

3 foto avatar bundar saling tumpang-tindih, dipasangkan dengan teks "Trusted by over 8.5M users worldwide". Memakai foto manusia asli (bukan ilustrasi) untuk kesan kredibel.

6.5 Follower Count Chip

Ikon platform sosial + angka follower singkat (500k di samping ikon X, 450k di samping ikon Discord), tanpa label teks tambahan — ikon sudah cukup menjelaskan konteks.

6.6 Statement Heading Block — Signature Pattern

Paragraf penjelasan 2–3 kalimat yang disetel dalam ukuran & weight setingkat H2, bukan body text biasa di bawah judul kecil. Contoh: "You pay for internet every month. But most of it goes unused... Now it works for you." Ini adalah cara paling khas Grass mengubah copy persuasif jadi terasa seperti pernyataan besar — dipakai berulang sebagai pengganti pola konvensional "judul kecil + paragraf di bawahnya".

6.7 Feature Block (Alternating/Zig-zag)

2 kolom: gambar produk di satu sisi, eyebrow label + Statement Heading di sisi lain. Arah berselang-seling antar section berurutan.

6.8 Trust Tag List

Kata kunci singkat berbentuk pill horizontal: Privacy · Security · Control — dipakai sebagai eyebrow pendukung sebelum Statement Heading tentang kepercayaan.

6.9 Numbered Step Card

Anatomi: angka besar (1/2/3) + judul + deskripsi singkat. Step pertama mendapat treatment "hero" (lebih besar + CTA di bawahnya), step lanjutan jadi konteks proses yang ringkas tanpa CTA — mengarahkan perhatian ke satu aksi utama.

6.10 CTA Banner (Download Band)

Section penuh dengan dekorasi pola dot/grain di background, mockup screenshot app, headline pendek, satu tombol Primary. Dipakai berulang — di homepage, halaman Download, dan penutup tiap artikel blog — jadi "penutup" yang konsisten di seluruh situs.

6.11 FAQ Accordion

Daftar pertanyaan (heading) dengan jawaban paragraf di bawahnya, ditutup link "Have more questions? Check out our full FAQ" yang mengarah ke dokumentasi eksternal (GitBook).

6.12 Content Filter Tabs

Tab horizontal berbentuk pill untuk filter kategori konten di halaman Learn: Videos / Basics / Discovery / News.

6.13 Story Card (Vertical Video Carousel) — Signature Pattern

Video vertikal dibungkus frame mockup ala iPhone ("iOS Frame"), disusun horizontal-scroll mirip format Stories/Reels media sosial. Tiap kartu: judul singkat, deskripsi 2 baris, tombol "SHARE". Komponen paling distinctive di situs ini — membawa bahasa visual media sosial ke dalam landing page edukasi, cocok untuk audiens yang familiar dengan TikTok/Instagram.

6.14 Blog/Article Header

Tag kategori (Featured, Basics) + tanggal publikasi + tombol share (Tweet, Copy Link) di atas judul artikel (H1) dan featured image.

6.15 Trust/Certification Badge Row

Dua grup logo institusional: "Member Of" (AMTSO) dan "Certified By" (AppEsteem), tampil di footer setiap halaman tanpa kecuali — elemen kredibilitas yang dianggap penting untuk diulang di mana-mana (relevan untuk produk DePIN/crypto yang sering dicurigai sebagai scam).

6.16 Footer

Anatomi: kolom brand (logo + ikon sosial: X, Discord, Telegram, Reddit, Instagram) — kolom navigasi (Home, Learn, FAQ, Media Kit, Documentation) — badge sertifikasi (§6.15) — baris copyright & link legal (Privacy Policy, Terms and Conditions, Cookie Policy, Cookie Settings).

7. Imagery, Iconography & Motion

Fotografi/mockup ✅ — situs ini condong ke mockup device nyata (screenshot app desktop/mobile) dan foto manusia asli (avatar), bukan ilustrasi vektor abstrak → kesan produk yang nyata & terpercaya, bukan janji abstrak.
Tekstur dekoratif ✅ — pola dot/grain dipakai di balik CTA band sebagai aksen visual ringan tanpa mengganggu keterbacaan.
Ikon ✅ — gaya simple/line-based untuk ikon trust pillar (Privacy/Security/Control) dan ikon media sosial di footer.
Motion 💡 — logomark dipakai sebagai loading spinner (terverifikasi). Untuk hover/scroll-reveal, pola umum di situs sejenis biasanya fade/slide-up saat scroll dan subtle scale-up saat hover button. Disarankan durasi singkat (150–250ms, ease-out) agar selaras dengan kesan "ringan, tidak mengganggu" dari brand.

8. Voice & Microcopy

Headline berbasis benefit, bahasa sehari-hari, sentence case, orang kedua ("you"/"your").
Voice percakapan & optimis — meski produknya berbasis Web3/crypto, istilah seperti "Tokens", "Points", "airdrop" selalu dijelaskan ulang dengan bahasa sederhana setiap kali muncul, bukan diasumsikan sudah dipahami pembaca.
Pesan kepercayaan/privasi diulang di hampir setiap section — ini bukan kebetulan, tapi respons langsung terhadap skeptisisme umum pada produk sejenis (penting dipertahankan kalau mereplikasi pola ini untuk brand serupa).
CTA konsisten memakai kata kerja yang sama berulang ("Download Grass") di banyak tempat, bukan variasi sinonim yang berbeda-beda — memperkuat satu aksi utama yang diinginkan.

9. Aksesibilitas

Kontras tinggi by default karena dominasi background terang + teks gelap (rasio ~10:1–19:1, lolos WCAG AAA).
Hindari teks putih di atas Primary Green (rasio ~1.3:1, gagal total) — selalu pasangkan dengan teks Black.
Sediakan focus state yang jelas (outline/ring) untuk navigasi keyboard pada semua elemen interaktif, terutama tombol pill yang low-contrast border-nya.

10. Catatan Teknis & Sumber

Berdasarkan struktur URL aset (/\_next/image, /\_next/static), situs ini dibangun dengan Next.js. Artikel blog di /learn/... tampak di-host lewat Ghost CMS (terlihat dari domain storage.ghost.io pada gambar artikel).
Halaman yang dianalisis: Homepage (/), Media Kit (/media-kit), Download (/download), Learn (/learn), contoh artikel (/learn/grass-puts-privacy-and-security-first).
Dokumentasi produk lebih dalam (FAQ lengkap, ketentuan airdrop) ada di GitBook terpisah (grass-foundation.gitbook.io) — di luar scope dokumen ini karena memakai theme GitBook sendiri, bukan design system grass.io.
