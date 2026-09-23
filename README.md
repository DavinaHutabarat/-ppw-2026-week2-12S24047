# Portofolio Web & Service Portal — Praktikum Minggu 03
## Modernisasi & Refactoring Berbasis Bootstrap 5.3 & Advanced Custom CSS

Repositori ini memuat hasil pengerjaan refactoring dan modernisasi halaman portofolio profil profesional serta portal layanan konsultasi web milik **Davina Olivia Yosefanny Hutabarat**, mahasiswa Program Studi S1 Sistem Informasi Institut Teknologi Del. Proyek ini merupakan kelanjutan dari Tugas Minggu 02 untuk mata kuliah **Pemrograman dan Pengujian Aplikasi Web (12S3101)**.

---

## 👩‍💻 Identitas Pengembang

| Atribut | Informasi Mahasiswa |
| :--- | :--- |
| **Nama Lengkap** | Davina Olivia Yosefanny Hutabarat |
| **NIM** | 12S24047 |
| **Program Studi** | S1 Sistem Informasi (Angkatan 2024) |
| **Fakultas** | Fakultas Informatika dan Teknik Elektro (FITE) |
| **Institusi** | Institut Teknologi Del |
| **Mata Kuliah** | Pemrograman dan Pengujian Aplikasi Web (12S3101) |
| **Dosen Pengampu** | Chandro Pardede, S.Kom., M.Sc. |
| **Cabang Git (Branch)** | `week3-bootstrap` |
| **Tautan Live Demo** | [https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/](https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/) |
| **Tautan Demo Lab 1** | [https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/lab1_specificity.html](https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/lab1_specificity.html) |

---

## 🚀 Ringkasan Pembaruan Refactoring (Minggu 03)

Pada praktikum Minggu 03 ini, arsitektur antarmuka web Minggu 02 telah direfaktor secara menyeluruh dengan mengadopsi standar framework kontemporer **Bootstrap 5.3.3** yang diselaraskan dengan **Advanced CSS Selectors** dan **Custom CSS Overrides**:

1. **Integrasi Framework Terstandarisasi**: Mengintegrasikan Bootstrap 5.3.3 CSS & JS bundle via CDN resmi serta Bootstrap Icons v1.11.3 tanpa merusak struktur semantik HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
2. **Responsive Navbar dengan Hamburger Collapse**: Bilah navigasi `sticky-top` dengan transisi blur kaca (backdrop-filter) dan tombol hamburger toggle responsif yang membuka/menutup menu di layar mobile secara mulus tanpa error console JavaScript.
3. **Hero Section 12-Kolom Seimbang**: Tata letak grid 12-kolom (`col-lg-7` dan `col-lg-5`) proporsional dengan call-to-action (CTA) ganda dan foto profil berornamen.
4. **Grid Portofolio & Modal Dialog Interaktif**: Menambah proyek ke-4 (*SIA Del Companion*) sehingga memiliki 4 kartu proyek (`.card`) dalam grid responsif `row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4`. Setiap kartu terhubung ke modal popup (`.modal`) Bootstrap dengan konten detail proyek yang kaya dan berbeda.
5. **Modernisasi Formulir Layanan**: Mengimplementasikan **Floating Labels** (`.form-floating`), **Input Groups** berikon, dropdown select kategori, radio prioritas, checkbox persetujuan, dan visual validasi interaktif (`.valid-feedback` dan `.invalid-feedback`) dengan skrip validasi native Bootstrap 5.
6. **Custom Overrides & Zero `!important`**: Mempertahankan identitas tema personal yang unik (*Soft Blush & Cherry Rose / Ballet-core Aesthetic*) dengan mendefinisikan 18 variabel CSS pada `:root`, mikro-interaksi kursor (`::before` animasi transform, hover elevasi), dan **100% bebas dari deklarasi `!important`**.
7. **Lab 1 Hands-on**: Menyertakan modul interaktif eksplorasi spesifisitas pada `lab1_specificity.html` serta mengintegrasikan kartu statistik metrik (`.metric-card`) pada halaman utama.

---

## 📊 Tabel Komparasi: Sebelum vs Sesudah Integrasi Framework

Tabel berikut menyajikan analisis mendalam perbandingan teknis antara kode Minggu 02 (CSS Murni) dengan kode Minggu 03 (Bootstrap 5.3 + Advanced CSS):

| Aspek Evaluasi | Sebelum (Minggu 02: Pure CSS) | Sesudah (Minggu 03: Bootstrap 5.3 + Custom CSS) | Manfaat & Peningkatan Arsitektur |
| :--- | :--- | :--- | :--- |
| **Fondasi & Sumber Daya** | Berkas CSS murni lokal (`style.css`), tanpa pustaka eksternal ikon. | CDN Bootstrap 5.3.3 CSS & JS Bundle + Bootstrap Icons v1.11.3 + `custom-style.css`. | Memanfaatkan komponen siap pakai berstandar industri dengan waktu muat cepat dan ikonografi SVG vektor. |
| **Sistem Tata Letak (Grid)** | CSS Grid & Flexbox manual dengan media queries spesifik (960px, 768px, 420px). | Sistem Grid 12-Kolom responsif Flexbox murni Bootstrap (`container`, `row`, `col-lg-*`, `col-md-*`). | Tata letak fluid yang adaptif sempurna di seluruh tingkatan breakpoint (xs, sm, md, lg, xl, xxl) tanpa celah layout. |
| **Bilah Navigasi (Navbar)** | Navigasi horizontal statis; item menu bertumpuk secara manual pada layar kecil. | Responsive Navbar `sticky-top` dengan tombol hamburger toggle collapse (`data-bs-toggle="collapse"`). | Pengalaman pengguna mobile ramah jempol, navigasi tertata rapi di balik hamburger menu tanpa memakan ruang layar. |
| **Koleksi Kartu Portofolio** | 3 kartu statis dalam CSS Grid tanpa aksi detail interaktif. | 4 kartu proyek (`.card`) dalam responsif grid (`row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4`). | Kerapian visual terstandarisasi, dilengkapi banner rasio 16:10, lencana kategori (`.portfolio-badge`), dan tombol aksi modal. |
| **Interaktivitas Detail Proyek** | Tidak ada pop-up detail, informasi terbatas pada ringkasan singkat kartu. | 4 Modal Dialog (`.modal`, `fade`) terpisah dengan konten latar belakang, fitur kunci, dan tech stack badge. | Pengunjung dapat meninjau detail teknis proyek secara mendalam tanpa harus berpindah halaman (*accessible & accessible dialog*). |
| **Formulir Layanan** | Kontrol input HTML klasik dengan label biasa di atas isian. | Formulir modern dengan **Floating Labels** (`.form-floating`) dan **Input Groups** berikon. | Antarmuka formulir ringkas, modern, menghemat ruang vertikal, dan memberikan konteks visual yang jelas lewat ikon. |
| **Umpan Balik Validasi Form** | Mengandalkan tooltip bawaan browser (HTML5 standard validation default). | State validasi visual dua arah: `.valid-feedback` (hijau) dan `.invalid-feedback` (merah) dengan ikon informatif. | Pengguna langsung mengetahui letak kekeliruan pengisian data secara visual dan intuitif sebelum form terkirim. |
| **Kalkulasi Spesifisitas** | Terdapat deklarasi `!important` untuk menimpa elemen tertentu. | **Zero `!important`**; aturan diatur secara elegan melalui hierarki cascading dan selektor spesifisitas alami. | Kode mudah dirawat (*maintainable*), terhindar dari *specificity war*, dan mematuhi prinsip *clean CSS*. |
| **Selektor CSS Lanjutan** | Selektor dasar elemen dan kelas. | Menggunakan kombinator (`>`, `+`), pseudo-classes (`:hover`, `:focus-within`, `:nth-child()`, `:is()`, `:not()`), dan pseudo-elements (`::before`, `::after`). | Efisiensi kode CSS yang jauh lebih tinggi dan mikro-interaksi hover garis aksen transform yang halus. |
| **Variabel CSS (:root)** | Variabel warna dasar. | Variabel lengkap (18 variabel) mencakup palet identitas, tipografi, radius sudut, elevasi bayangan, dan timing transisi. | Tema personal tetap konsisten dan memudahkan kustomisasi tema secara terpusat (*theming architecture*). |

---

## 📁 Struktur Berkas Proyek

```
ppw-2026-week2-12S24047/
├── index.html              # Halaman utama portofolio terefaktor (Bootstrap 5.3 + Semantik)
├── custom-style.css        # Berkas CSS kustom overrides (dimuat setelah Bootstrap, Zero !important)
├── style.css               # Berkas CSS cadangan / pengarah ke custom-style.css
├── lab1_specificity.html   # Demonstrasi praktikum Lab 1: Kalkulasi spesifisitas & selector
├── README.md               # Dokumentasi lengkap, tabel komparasi, dan petunjuk teknis
└── assets/
    ├── pita.svg            # Favicon pita identitas web
    ├── Foto-Profil.png     # Foto profil pengembang
    ├── proyek-andalitrack.jpg # Banner proyek 1 (AndaliTrack)
    ├── proyek-partyup.jpg     # Banner proyek 2 (PartyUp!)
    ├── ProyekTitikMu.png      # Banner proyek 3 (TemanTumbuh)
    └── proyek-siadel.svg      # Banner proyek 4 (SIA Del Companion - Proyek Baru)
```

---

## 🎨 Arsitektur Theming & Advanced CSS

### 1. CSS Custom Properties (`:root`)
Portofolio ini mendefinisikan 18 variabel CSS pada scope `:root` untuk mempertahankan identitas *Ballet-core / Soft Rose & Cherry Plum*:
- `--primary-brand`: `#DE5D83` (Cherry Rose)
- `--primary-hover`: `#B83256` (Deep Rose)
- `--surface-bg`: `#FFFFFF`
- `--bg-page`: `#FFFDFD`
- `--bg-alt`: `#FFF0F4`
- `--text-main`: `#2E282A` (WCAG 2.2 AA Contrast Compliant)
- `--card-radius`: `18px`
- `--shadow-lift`: `0 12px 28px -6px rgba(222, 93, 131, 0.18)...`

### 2. Implementasi Advanced Selectors
- **Child Combinator (`A > B`)**: Mengontrol penataan elemen langsung tanpa merembet ke sub-elemen (`.skills-list > li`, `.workflow-list > li`).
- **Adjacent Sibling (`A + B`)**: Memberikan margin presisi pada elemen yang berdekatan (`.input-group-text + .form-control`, `h3 + p`).
- **Pseudo-class `:focus-within`**: Memberikan iluminasi border dan bayangan pada kartu formulir saat ada elemen input di dalamnya yang sedang aktif.
- **Pseudo-class `:nth-child()`**: Pewarnaan baris selang-seling pada tabel riwayat akademik (`tr:nth-child(even)`).
- **Pseudo-class `:is()` & `:not()`**: Mengelompokkan heading dan selektor navigasi secara efisien (`:is(h1, h2, h3)`, `.nav-link:not(.active):hover`).
- **Pseudo-element `::before` & `::after`**: Menghasilkan garis aksen animasi transform (`transform: scaleX(1)`) pada kartu metrik statistik dan kartu portofolio saat kursor diarahkan (*hover*).

---

## 🛠️ Menjalankan Proyek Secara Lokal

1. Kloning repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/DavinaHutabarat/-ppw-2026-week2-12S24047.git
   cd -ppw-2026-week2-12S24047
   ```
2. Berpindah ke cabang `week3-bootstrap`:
   ```bash
   git checkout week3-bootstrap
   ```
3. Buka berkas `index.html` langsung di peramban web modern (Google Chrome / Mozilla Firefox / Microsoft Edge), atau gunakan ekstensi **Live Server** pada Visual Studio Code.

---

## 🌐 Publikasi GitHub Pages

Untuk memastikan halaman dapat diakses secara publik tanpa error 404:
1. Buka repositori di GitHub: `https://github.com/DavinaHutabarat/-ppw-2026-week2-12S24047`
2. Klik tab **Settings** → menu **Pages** di bilah sisi kiri.
3. Pada bagian **Build and deployment > Branch**:
   - Pilih Branch: `week3-bootstrap` (atau `main` jika telah di-merge).
   - Folder: `/ (root)`.
4. Klik **Save**. Halaman akan terpublikasi dalam 1–2 menit pada tautan:
   [https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/](https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/)

---

## 📷 Tangkapan Layar Halaman Hasil Refactoring

*(Tangkapan layar antarmuka hasil integrasi Bootstrap 5.3, Responsive Navbar, 4 Kartu Portofolio, Modal Dialog, dan Floating Labels)*

> Halaman web dapat diuji langsung secara responsif di berbagai resolusi layar (Mobile 375px–420px, Tablet 768px, Laptop 1024px, hingga Desktop 1440px) melalui Chrome DevTools (Device Emulation).

---
*Institut Teknologi Del · Fakultas Informatika dan Teknik Elektro · Sarjana Sistem Informasi 2026*
