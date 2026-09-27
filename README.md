# -ppw-2026-week2-12S24047
# Portofolio Web Praktikum Week 02 

Halaman web portofolio profil profesional tunggal (*single page showcase*) yang dibangun
dengan HTML5 semantik dan CSS modern. Dikerjakan sebagai Tugas Mandiri Minggu 02 mata kuliah
**Pemrograman dan Pengujian Aplikasi Web (12S3101)**, Institut Teknologi Del.

| Keterangan | Isi |
| --- | --- |
| Nama | Davina Olivia Yosefanny Hutabarat |
| NIM | 12S24047 |
| Program Studi | S1 Sistem Informasi, Fakultas Informatika dan Teknik Elektro |
| Dosen Pengampu | Chandro Pardede, S.Kom., M.Sc. |
| Live Demo | (https://davinahutabarat.github.io/-ppw-2026-week2-12S24047/) |



## Pemenuhan Spesifikasi Teknis

**1. Struktur semantik HTML5**
`<header>` berisi logo dan `<nav>`, satu `<main>`, empat `<section>` (Tentang Saya, Portofolio
Karya, Riwayat Akademik, Formulir Layanan), `<article>` untuk setiap kartu proyek, `<aside>`
berisi tanya jawab singkat, dan `<footer>` dengan hak cipta serta navigasi sekunder. Tidak ada
`<div>` pembungkus tanpa makna selain wadah tata letak.

**2. Penyajian data tabular & lists**
Tabel rekapitulasi mata kuliah dengan `<caption>`, `<thead>`, `<tbody>`, `<tfoot>` (total SKS
dan IP sementara), serta `scope="col"` dan `scope="row"`. Terdapat `<ul>` untuk daftar keahlian,
`<ol>` untuk alur pengerjaan proyek, dan `<dl>` pada bagian tanya jawab.

**3. Komponen formulir interaktif & accessible**
Dua `<fieldset>` utama dengan `<legend>`, memuat sembilan tipe kontrol input: text, email, tel,
number, date, select, radio, checkbox, dan textarea. Seluruh input punya `<label for="...">`
eksplisit, atribut validasi native (`required`, `pattern`, `min`, `max`), teks bantuan yang
dirujuk lewat `aria-describedby`, serta indikator fokus yang terlihat jelas.

**4. Estetika & tata letak CSS modern**
CSS eksternal dengan universal box sizing reset. Palet 60-30-10 didefinisikan sebagai CSS
variables: 60% latar netral hangat (`#faf7f2`, `#f0ebe2`), 30% teks dan garis (`#1d232b`,
`#5b6672`), 10% aksen merah ulos (`#9e2b25`) dengan pendukung hijau danau (`#1f5e5b`).
Tipografi memadukan Fraunces untuk judul dan Inter untuk teks isi. Tata letak memakai CSS Grid
(galeri proyek, kolom formulir) dan Flexbox (navigasi, footer, kelompok tombol), dengan
`border-radius`, bayangan lembut berlapis, transisi hover, dan media queries pada 960px, 768px,
serta 420px.

**5. Git & GitHub Pages**
Repositori publik `ppw-2026-week2-12S24047`, riwayat commit bertahap, dan halaman live melalui
GitHub Pages.


## Menjalankan Secara Lokal

1. Unduh atau clone repositori ini.
2. Buka `index.html` di browser, atau gunakan ekstensi **Live Server** di VS Code.

## Deployment

```bash
git init
git add .
git commit -m "feat: complete week 2 html5 and modern css assignment"
git remote add origin https://github.com/DavinaHutabarat/ppw-2026-week2-12S24047.git
git branch -M main
git push -u origin main
```


Institut Teknologi Del · Sitoluama, Laguboti, Toba Samosir
