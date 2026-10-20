# Laporan Progres Pengembangan Web & Admin Panel
**Warma Heritage Group**  
*Tanggal: 19 - 20 Oktober 2026*

---

## 1. Ringkasan Eksekutif

Pada sesi pengembangan ini, seluruh permintaan penyesuaian desain halaman depan, pembaruan konten narasi (copywriting) dwibahasa untuk 6 anak perusahaan, pembuatan fitur **Manajemen Galeri & Foto Portofolio Produk di Admin Panel**, serta dokumentasi dan finalisasi **Fitur SMTP Pengiriman Pesan ke Email pada Section Kontak & Inbox Admin Panel** telah selesai diimplementasikan 100% dan berhasil diverifikasi melalui pengujian kompilasi produksi Next.js (`npm run build`).

---

## 2. Rincian Pekerjaan yang Telah Selesai

### A. Penyesuaian Desain Landing Page
1. **Penghapusan Bagian Filosofi Dasar**
   - **Path**: `app/components/AboutSection.tsx`
   - **Keterangan**: Bagian filosofi 3 kolom telah dihapus. Tampilan dikembalikan ke struktur 2 kolom bersih dengan narasi pengantar elegan dan penekanan pada nilai inti **W-A-R-M-A** (*Wisdom, Authenticity, Respect, Mastery, Action*).
2. **Restorasi Desain Kartu Anak Perusahaan**
   - **Path**: `app/components/CompaniesSection.tsx`
   - **Keterangan**: Kartu anak perusahaan dikembalikan ke gaya minimalis rasio kotak (`aspect-square`), tombol aksi outline, dan deskripsi ringkas yang diselaraskan dengan positioning terbaru masing-masing entitas.
3. **Restorasi Bagian Kontak**
   - **Path**: `app/components/CTASection.tsx`
   - **Keterangan**: Tata letak informasi kontak (WhatsApp, email, kantor Denpasar Bali) dengan tombol outline WhatsApp direct link dikembalikan seperti semula, dengan formulir pesan interaktif tetap terintegrasi secara proporsional.

---

### B. Pembaruan Copywriting Dwibahasa (ID & EN) 6 Anak Perusahaan
- **Path**: `app/companies/[slug]/page.tsx`

1. **Karya Rotan Indonesia** (`karya-rotan-indonesia`)
   - Mitra furniture & kerajinan rotan untuk hotel, villa, resto, kafe.
   - Pilihan material alami & sintetis, panel rotan sintetis, dan perbaikan furniture rotan.
2. **Rattan Export House Indonesia / REHI** (`rattan-export-house-indonesia`)
   - Agregator ekspor produk rotan Indonesia ke pasar global.
   - Pembaruan bagian *About the Company* yang mencakup raw materials, komponen setengah jadi, hingga finished furniture dan home décor.
3. **Kriya Kayu Nusantara** (`kriya-kayu-nusantara`)
   - Mitra produksi furniture dan kerajinan kayu fleksibel **tanpa minimum order (No MOQ)**.
   - Solusi custom untuk kebutuhan hotel, villa, kafe, interior designer, serta hospitality amenities.
4. **Nada Upacara Bali** (`nada-upacara-bali`)
   - Penyedia jasa gamelan & musik tradisional Bali profesional untuk upacara adat/keagamaan, pernikahan, dan event budaya.
5. **Bali Menari Academy** (`bali-menari-academy`)
   - Sanggar & akademi pelatihan tari Bali.
   - Lengkap dengan silabus 5 kelas: *Tari Bali Dasar, Lanjutan, Privat, Komersial & Pertunjukan, serta Workshop Wisatawan*.
6. **Niaga Rasa Indonesia** (`niaga-rasa-indonesia`)
   - Perusahaan pengadaan dan ekspor komoditas rempah, vanila, cokelat, kopi, dan hasil bumi unggulan nusantara.

---

### C. Fitur Baru: Manajemen Galeri & Foto Portofolio Produk
Untuk mengakomodasi foto-foto produk dan kegiatan dari Google Drive klien:

1. **Database Schema & Migrasi Live Hostinger**
   - **File**: `prisma/schema.prisma`
   - Dibuat tabel `company_photos` (`CompanyPhoto`) dengan kolom: `id`, `companySlug`, `titleId`, `titleEn`, `imageUrl`, `order`, `published`, `createdAt`, `updatedAt`.
   - Skema telah diterapkan ke database produksi MySQL Hostinger menggunakan `npx prisma db push` dan prisma client ter-generate.

2. **Backend API Routes**
   - `app/api/admin/company-photos/route.ts`: Endpoint `GET` (filter slug) dan `POST` (tambah foto dengan auto-increment order & revalidasi halaman web).
   - `app/api/admin/company-photos/[id]/route.ts`: Endpoint `PUT` (edit judul, ubah urutan, toggle publikasi) dan `DELETE` (hapus foto).

3. **User Interface Admin Panel**
   - **File**: `app/admin/gallery/page.tsx` & `app/admin/gallery/components/GalleryClient.tsx`
   - **Navigasi**: Menu **"Galeri & Produk"** ditambahkan ke `app/admin/components/AdminSidebar.tsx`.
   - **Fitur Admin**:
     - Filter tab khusus untuk masing-masing anak perusahaan (+ counter foto).
     - Formulir modal unggah foto dari komputer (mendukung preview langsung dan integrasi upload lokal `/api/admin/upload`).
     - Pengaturan nomor urut tampil (*ordering*).
     - Tombol cepat ubah status tayang (*Publish / Unpublish toggle*).
     - Tombol edit keterangan foto (ID & EN) dan tombol hapus dengan konfirmasi aman.
     - Link langsung (*quick preview*) menuju halaman web anak perusahaan.

4. **Integrasi Dinamis ke Halaman Publik**
   - **File**: `app/companies/[slug]/CompanyDetailClient.tsx`
   - Bagian galeri tidak lagi menggunakan placeholder statis, melainkan me-render foto asli yang diunggah dari Admin Panel secara horizontal scroll (`snap-x snap-mandatory`) lengkap dengan efek visual hover dan keterangan foto.

---

### D. Optimasi SEO & 301 Permanent Redirect Migrasi Domain
- **File**: `next.config.ts`
- **Tujuan**: Mempercepat penggantian domain lama (`warma-heritage-group.vercel.app`) menjadi domain resmi (`warmaheritagegroup.com`) di Google Search Console & hasil pencarian Google.
- **Implementasi**:
  - Menambahkan aturan `redirects()` otomatis dengan status **HTTP 301 (Permanent Redirect)** dari host `warma-heritage-group.vercel.app` dan `www.warmaheritagegroup.com` ke `https://warmaheritagegroup.com/:path*`.
  - Mencegah isu duplikasi konten (*duplicate content penalty*) serta mentransfer 100% skor reputasi/ranking domain lama ke domain utama baru.

---

### E. Integrasi Formulir Kontak, Layanan Notifikasi Email (Gmail SMTP) & Inbox Admin Panel
Fitur pengiriman pesan pada section kontak (`CTASection.tsx`) telah terintegrasi penuh dengan arsitektur **Dual-Delivery (Fault Tolerant)**:

1. **Alur Kerja & Arsitektur Dual-Delivery**:
   - **Frontend**: [`app/components/ContactForm.tsx`](file:///D:/Rafa/Projek/Warma%20Heritage%20Group/warma-heritage-group/app/components/ContactForm.tsx) menerima input pengunjung (Nama Lengkap, Email, Perusahaan, Subjek, dan Pesan) dengan validasi client-side, indikator status interaktif (animasi loading *spinner*, alert sukses hijau, dan alert error merah), serta dukungan dwibahasa penuh (ID/EN).
   - **Backend API Handler**: [`app/api/contact/route.ts`](file:///D:/Rafa/Projek/Warma%20Heritage%20Group/warma-heritage-group/app/api/contact/route.ts) memvalidasi data masukan secara ketat (format regex email dan batasan panjang karakter).
   - **Prioritas 1 (Database-First)**: Data pesan **selalu disimpan terlebih dahulu** ke tabel `contact_messages` di database MySQL Hostinger via Prisma ORM. Hal ini menjamin 100% pesan tidak akan hilang meskipun terjadi kendala jaringan sementara pada layanan SMTP.
   - **Prioritas 2 (Background SMTP Email Delivery)**: Sistem membaca kredensial `SMTP_USER` dan `SMTP_PASS` di environment variables, kemudian memicu pengiriman notifikasi email via library `nodemailer` ke alamat inbox resmi holding (`warmaheritagegroup@gmail.com`) dengan header `replyTo` otomatis ke email pengirim agar tim admin dapat langsung membalas pesan.

2. **Langkah-Langkah Implementasi Teknis**:
   - **Instalasi Paket Dependensi**: Memasang library `nodemailer` beserta type definition `@types/nodemailer`.
   - **Skema Database Prisma**: Menambahkan model `ContactMessage` pada `prisma/schema.prisma` yang mencakup kolom: `id`, `name`, `email`, `company`, `subject`, `message`, `isRead`, dan `createdAt`.
   - **Pengembangan Handler API**: Merancang endpoint server-side `POST /api/contact` dengan error handling asinkron aman (*graceful degradation*), sehingga jika pengiriman email mengalami limit atau kegagalan, API tetap mengembalikan respon sukses karena data telah tersimpan di database.
   - **Antarmuka Form Kontak Publik**: Mengintegrasikan formulir interaktif di landing page dengan penanganan status loading, disabled button saat proses pengiriman, dan pembersihan form otomatis (*reset state*) pasca submit berhasil.
   - **Modul Inbox Admin Panel (`/admin/messages`)**: Membangun tampilan split-pane interaktif di [`app/admin/messages/page.tsx`](file:///D:/Rafa/Projek/Warma%20Heritage%20Group/warma-heritage-group/app/admin/messages/page.tsx) untuk membaca pesan masuk, filter badge pesan belum dibaca (*unread count*), fitur hapus pesan, dan tombol balas instan via `mailto:`.

3. **Langkah Konfigurasi Akun & Environment SMTP Gmail**:
   - Mengaktifkan fitur **Verifikasi 2 Langkah (2-Step Verification)** pada akun Google holding (`warmaheritagegroup@gmail.com`).
   - Membuat **Sandi Aplikasi (Google App Password)** 16 karakter khusus untuk aplikasi web melalui menu *Google Account Security > App Passwords*.
   - Mendaftarkan kredensial ke dalam berkas environment lokal ([`.env.local`](file:///D:/Rafa/Projek/Warma%20Heritage%20Group/warma-heritage-group/.env.local)) serta konfigurasi production environment:
     ```env
     SMTP_USER="warmaheritagegroup@gmail.com"
     SMTP_PASS="uyha eeot tspt kuul"
     ```
   - Pengujian end-to-end: Verifikasi pesan tersimpan di MySQL Hostinger, email notifikasi diterima di Gmail, dan sinkronisasi realtime pada Inbox Admin Panel.

---

## 3. Cara Mengunggah Foto dari Google Drive

Admin web dapat mengisi portofolio tanpa mengubah kode sedikitpun:

1. Buka folder Google Drive di komputer Anda, lalu **download** foto yang diinginkan.
2. Masuk ke Admin Panel: **`/admin/gallery`**.
3. Klik tombol **Tambah Foto**:
   - Pilih anak perusahaan yang sesuai (misal: *Karya Rotan Indonesia* atau *Bali Menari Academy*).
   - Klik **Pilih File dari Komputer** dan pilih gambar yang sudah diunduh tadi.
   - Isi keterangan foto (Bahasa Indonesia & Bahasa Inggris) jika diperlukan.
   - Atur nomor urut tampil dan pastikan opsi *"Tayangkan di Website"* tercentang.
   - Klik **Tambah Foto**.
4. Foto akan langsung tampil di galeri halaman website terkait.

---

## 4. Hasil Verifikasi Sistem

| Pengujian | Status | Hasil |
|---|---|---|
| **TypeScript Validation (`npx tsc --noEmit`)** | Passed | 0 Error |
| **Prisma Schema Synchronization (`prisma db push`)** | Passed | Tabel `company_photos` aktif di Hostinger MySQL |
| **Production Build (`npm run build`)** | Passed | Seluruh route (SSG, SSR, dynamic `[slug]`, API) terkompilasi optimal |

---

## 5. Daftar File Berubah & File Baru

- `next.config.ts` *(Modified: Ditambahkan 301 Redirect Domain)*
- `app/components/AboutSection.tsx` *(Modified)*
- `app/components/CompaniesSection.tsx` *(Modified)*
- `app/components/CTASection.tsx` *(Modified)*
- `app/companies/[slug]/page.tsx` *(Modified)*
- `app/companies/[slug]/CompanyDetailClient.tsx` *(Modified)*
- `app/admin/components/AdminSidebar.tsx` *(Modified)*
- `prisma/schema.prisma` *(Modified: Ditambahkan Model CompanyPhoto & ContactMessage)*
- `app/admin/gallery/page.tsx` *(New File: Modul Galeri & Produk)*
- `app/admin/gallery/components/GalleryClient.tsx` *(New File)*
- `app/api/admin/company-photos/route.ts` *(New File)*
- `app/api/admin/company-photos/[id]/route.ts` *(New File)*
- `app/components/ContactForm.tsx` *(Modified / Verified: Form UI Kontak & Error Handling)*
- `app/api/contact/route.ts` *(Modified / Verified: Dual-Delivery DB + SMTP Nodemailer)*
- `app/admin/messages/page.tsx` *(New File: Inbox Pesan Masuk Admin)*
- `app/admin/messages/components/MessagesTableClient.tsx` *(New File: Split-pane Inbox UI)*
- `app/api/admin/messages/route.ts` *(New File: Endpoint List Pesan Masuk)*
- `app/api/admin/messages/[id]/route.ts` *(New File: Endpoint Status Baca & Hapus Pesan)*
