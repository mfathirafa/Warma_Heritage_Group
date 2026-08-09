# PROJECT STATUS — Warma Heritage Group

> Checkpoint ini dibuat pada 2026-08-09 berdasarkan inspeksi langsung source code, git history, dan query read-only ke Notion API. Diperbarui berkelanjutan pada hari yang sama setelah dua fase kerja (aset foto + `/api/contact`). Tidak ada yang diasumsikan dari percakapan sebelumnya.

---

## 1. Project Overview

| | |
|---|---|
| **Tujuan** | Website resmi Warma Heritage Group — holding company berbasis warisan budaya Indonesia yang membawahi 6 anak perusahaan |
| **Framework** | Next.js 16.2.9 (App Router, Turbopack) |
| **React** | 19.2.4 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 (custom @theme grey scale di globals.css) |
| **Font** | Inter (sans/body) + Sorts Mill Goudy (serif/headings) |
| **CMS** | Notion (@notionhq/client ^2.3.0) — blog posts + social impact |
| **Deployment** | Vercel — `https://warma-heritage-group.vercel.app` (metadataBase sudah diatur, tapi local commit belum di-push) |
| **Bahasa** | Indonesia (default) + English, toggle ID/EN via localStorage (`useLang` hook) |

---

## 2. Current Architecture

### Struktur File

```
warma-heritage-group/
├── app/                          ← BUKAN src/app, langsung di root
│   ├── layout.tsx                ← Root layout: metadata, JsonLd, BackToTop
│   ├── page.tsx                  ← Server component: fetch socialImpacts dari Notion
│   ├── HomeClient.tsx            ← Client: render semua section landing
│   ├── globals.css               ← Custom Tailwind theme + scroll reveal CSS
│   ├── not-found.tsx             ← Custom 404
│   ├── error.tsx                 ← Global error boundary
│   ├── sitemap.ts                ← Dynamic sitemap (blog + 6 companies)
│   ├── robots.ts                 ← Robots.txt
│   ├── favicon.ico
│   ├── hooks/
│   │   ├── useLang.ts            ← Language state (ID/EN) + localStorage
│   │   └── useScrollReveal.ts    ← IntersectionObserver for reveal animations
│   ├── lib/
│   │   ├── constants.ts          ← Company info, NAV_LINKS, WA_MESSAGES, types
│   │   └── notion.ts             ← Notion SDK: getBlogPosts, getBlogPostBySlug, getSocialImpacts
│   ├── api/
│   │   └── contact/route.ts      ← POST /api/contact: validasi input + kirim email via Gmail SMTP (nodemailer)
│   ├── components/
│   │   ├── Navbar.tsx            ← Sticky, mobile menu, ID/EN toggle
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FounderSection.tsx
│   │   ├── CompaniesSection.tsx  ← 6 company cards (static array)
│   │   ├── ServicesSection.tsx
│   │   ├── SocialImpactSection.tsx ← Notion-driven + fallback array
│   │   ├── CTASection.tsx        ← Contains ContactForm + WA link
│   │   ├── ContactForm.tsx       ← Form UI, POSTs ke /api/contact (backend sudah ada, lihat api/contact/)
│   │   ├── Footer.tsx
│   │   ├── JsonLd.tsx            ← Schema.org Organization structured data
│   │   └── BackToTop.tsx
│   ├── blog/
│   │   ├── page.tsx              ← Blog list (server, fetches from Notion)
│   │   ├── BlogClient.tsx        ← Client: category filter, grid, read time
│   │   ├── loading.tsx           ← Skeleton
│   │   ├── error.tsx
│   │   └── [slug]/
│   │       ├── page.tsx          ← Blog detail (server, generatesMetadata)
│   │       ├── BlogDetailClient.tsx ← Reading progress, share buttons, content parser
│   │       ├── loading.tsx
│   │       └── error.tsx
│   └── companies/
│       └── [slug]/
│           ├── page.tsx          ← Server: static companies record + generateMetadata
│           ├── CompanyDetailClient.tsx ← Hero, About, Highlights, Services, Gallery, CTA
│           ├── loading.tsx
│           └── error.tsx
├── refs/                         ← Referensi foto + PDF (tracked di git, bukan public/)
├── public/
│   ├── Logo_clear.png, favicon.ico, default Next.js SVGs
│   └── images/                   ← Aset foto: hero.png, about.jpg, founders/ (3), companies/ (6), social/ (7)
├── pdf_text.txt                  ← Hasil ekstraksi teks dari PDF copywriting
└── .env.local                    ← NOTION_TOKEN, NOTION_BLOG_DATABASE_ID, NOTION_SOCIAL_IMPACT_DATABASE_ID, SMTP_USER, SMTP_PASS (kosong) — plus unused OPENAI_API_KEY/OPENAI_BASE_URL
```

### Data Flow — Notion

```
page.tsx (server, revalidate=60)
  → lib/notion.ts: getSocialImpacts() → query Notion DB, filter Status='Published', sort by Order
    → returns SocialImpact[] ke HomeClient → SocialImpactSection
    → fallback jika kosong: 3 item hardcoded di SocialImpactSection.tsx
```

Blog serupa: `blog/page.tsx` → `getBlogPosts()` → Notion DB → `BlogClient`.

### Routing

| Route | Render | Source |
|---|---|---|
| `/` | Static (ISR 60s) | page.tsx (server) → HomeClient |
| `/blog` | Static (ISR 60s) | blog/page.tsx → BlogClient |
| `/blog/[slug]` | Dynamic | blog/[slug]/page.tsx → BlogDetailClient |
| `/companies/[slug]` | Dynamic | companies/[slug]/page.tsx → CompanyDetailClient |
| `/api/contact` (POST) | Dynamic | api/contact/route.ts → Node runtime, nodemailer Gmail SMTP |
| `/sitemap.xml` | Static | sitemap.ts (dynamic import from Notion) |
| `/robots.txt` | Static | robots.ts |
| not-found | Static | not-found.tsx |
| error | — | error.tsx |

### API Routes

**`/api/contact` (POST)** — `app/api/contact/route.ts`. Menerima JSON `{ name, email, company, subject, message }` dari ContactForm.tsx, validasi strict (field wajib, format email, batas panjang), lalu kirim email via Gmail SMTP (`nodemailer`). Route handler Node runtime, POST tidak di-cache. Method selain POST → 405 (otomatis).

Alur: parse JSON → validasi (400 jika gagal) → cek `SMTP_USER`/`SMTP_PASS` (500 jika belum dikonfigurasi) → `sendMail` ke inbox `warmaheritagegroup@gmail.com` dengan `replyTo` = email pengirim → 200 `{ success: true }`. Error pengiriman → 500 dengan pesan aman (detail di `console.error`).

**Status: route selesai & terverifikasi. Pengiriman email aktual menunggu `SMTP_PASS` (App Password Google) diisi user** (lihat Section 7).

### Environment Variables

Diperlukan (required, `requireEnv` akan throw jika kosong):
- `NOTION_TOKEN` — Notion integration token
- `NOTION_BLOG_DATABASE_ID` — Database ID blog posts
- `NOTION_SOCIAL_IMPACT_DATABASE_ID` — Database ID social impact

Ada tapi TIDAK dipakai kode (sisa config sesi sebelumnya):
- `OPENAI_API_KEY` → localhost:20128 (unused)
- `OPENAI_BASE_URL` → localhost:20128 (unused)

Email (dipakai `/api/contact`, ditambahkan 2026-08-09 atas persetujuan user):
- `SMTP_USER` → `warmaheritagegroup@gmail.com` (Gmail SMTP, host `smtp.gmail.com:587`)
- `SMTP_PASS` → **MASIH KOSONG** — App Password Google (2-step verification) harus diisi user. Sampai terisi, `/api/contact` balas `500 Email belum dikonfigurasi` (guard, tidak ada email yang dicoba kirim).

---

## 3. Completed Features

### ✅ Landing Page (Single Long-Page)
9 section berurutan: Hero → About → Founder → Companies → Services → Social Impact → CTA/Contact → Footer. Scroll-to-section via anchor link.

### ✅ Dual Language (ID/EN)
Toggle ID/EN di Navbar, persist ke localStorage via `useLang` hook. Semua teks konten tersedia dalam dua bahasa. Blog hanya ID (lihat Known Issues).

### ✅ Companies (6 Perusahaan)
- Cards di CompaniesSection.tsx (static array, 6 item), logo per slug dari `public/images/companies/*.png`
- Detail pages: `/companies/[slug]` dengan Hero (logo), About (logo), Highlights, Services, Gallery placeholder, CTA
- Setiap company punya custom WA message per bahasa
- Copywriting berasal dari PDF "Revisi Copywriting WHG Website.pdf"

### ✅ Blog (CMS-driven)
- List page: category filter, grid 3 kolom, read time, cover image (Notion file), share buttons (WA/Copy Link/X)
- Detail page: reading progress bar, back link, meta (category/date/read time), content parser (heading `#`/`##`, blockquote `>`, paragraphs), share buttons, author badge
- Loading skeletons untuk list dan detail
- 2 blog posts published di Notion (ID-only)

### ✅ Navigation
Sticky navbar, scroll-aware background transition, mobile hamburger menu, anchor scroll to sections, `/blog` direct navigation via router.push.

### ✅ Footer
3 kolom: logo + deskripsi, nav links, contact info. All links functional. Copyright 2026.

### ✅ SEO
- Meta tags (title template, description, keywords, authors, creator)
- Open Graph + Twitter Card
- JSON-LD (Organization schema dengan 6 subOrganization)
- Dynamic sitemap (auto-includes blog posts from Notion)
- robots.txt (allow all)
- Google Search Console verification
- Custom 404 page
- Per-page OG via generateMetadata (blog detail + company detail)

### ✅ Animation
Scroll reveal via IntersectionObserver (`useScrollReveal` hook + CSS `.reveal` classes). Delay classes `reveal-delay-1` hingga `reveal-delay-4`.

### ✅ Contact
Front-end form (ContactForm.tsx) — name, email, company, subject, message. Success/error states. **Backend `/api/contact` (POST) sudah ada** — validasi strict + kirim email via Gmail SMTP (nodemailer). Menunggu `SMTP_PASS` (App Password) diisi user untuk pengiriman aktual.

### ✅ Social Impact
Section horizontal scroll di landing page. Data dari Notion (getSocialImpacts). Cover: prioritas `cover` dari Notion → fallback lokal `localCovers` (dipetakan per judul program) → placeholder. Semua 7 program tampil dengan foto lokal.

### ✅ Foto & Aset
18 foto terintegrasi via `next/image` (fill + objectFit): hero, about, 3 founder, 6 logo perusahaan (CompaniesSection + CompanyDetail hero/about), 7 foto social impact. Layout aspect-square/aspect-video dipertahankan. Originals tetap di `refs/`.

### ✅ Error Handling & Loading
Custom error boundaries: `app/error.tsx`, `blog/error.tsx`, `blog/[slug]/error.tsx`, `companies/[slug]/error.tsx`. Custom not-found.tsx. Loading skeletons: blog list, blog detail, company detail.

### ✅ Back to Top
Floating button, appears on scroll > 400px.

---

## 4. Recent Changes

Semua perubahan berikut sudah **committed** (commit `eede18c`, 2026-08-08 21:30 +0700):

- **Update copywriting 6 perusahaan** sesuai PDF "Revisi Copywriting WHG Website.pdf" — di CompaniesSection.tsx (card descriptions) dan companies/[slug]/page.tsx (taglines, descriptions, highlights, services). Diff menunjukkan deskripsi lama diganti total.
- **Bali Menari → Bali Menari Academy** — slug `bali-menari` → `bali-menari-academy`, deskripsi berubah dari "seni pertunjukan" → "kelas tari tradisional dan modern", WA message disesuaikan.
- **Update email**: `WarmaGroup@gmail.com` → `warmaheritagegroup@gmail.com` (constants.ts)
- **Update alamat**: `Jl. Tukad Yeh Aya IX No. 90, Denpasar, Bali 80226` → `Jalan Sekar Tunjung XV No. 1A, Denpasar, Bali 80237` (constants.ts)
- **Niaga Rasa Indonesia**: deskripsi dari "usaha kuliner autentik berbasis cita rasa" → "perusahaan ekspor produk pertanian Indonesia"
- **Tambah `pdf_text.txt`** — hasil ekstraksi teks PDF copywriting, dipakai sebagai referensi copy
- **Tambah `refs/`** — foto founder (3), logo anak perusahaan (6), foto social impact (7), hero photo, about photo, PDF asli. Semua tracked di git.
- **Tambah komponen error/loading** untuk blog, blog detail, company detail, dan global error
- **Tambah ContactForm.tsx** — form UI (belum ada backend)
- **Hapus komponen** `BlogSkeleton.tsx`, `PlaceholderImage.tsx`, `SectionHeader.tsx`, `WhatsAppButton.tsx` (tergantikan atau tidak dipakai)
- **Fix typo**: `.gitignore` entry untuk `.env.local`, BlogSkeleton, JsonLd, not-found
- **Commit terbaru belum di-push**: `main` ahead of `origin/main` by 1 commit

**Perubahan BELUM di-commit** (2 fase sesudah `eede18c`, status 2026-08-09 — lihat `git status`):

### Fase 1 — Integrasi Aset Foto (selesai, belum commit)
- `app/components/HeroSection.tsx` — `<Image src="/images/hero.png">` (`fill`, `objectFit: cover`, `preload` untuk LCP)
- `app/components/AboutSection.tsx` — `<Image src="/images/about.jpg">` (`fill`, `cover`)
- `app/components/FounderSection.tsx` — 3 foto founder via map `founderPhotos` (`fill`, `cover`)
- `app/components/CompaniesSection.tsx` — 6 logo via `/images/companies/{id}.png` (`fill`, `contain`)
- `app/companies/[slug]/CompanyDetailClient.tsx` — logo di Hero (aspect-square) & About (aspect-video) (`fill`, `contain`)
- `app/components/SocialImpactSection.tsx` — fallback lokal `localCovers` (judul → `public/images/social/*.jpg`), prioritas render: Notion Cover → lokal → placeholder
- `public/images/` — 18 aset foto dicopy dari `refs/` (hero, about, 3 founder, 6 logo, 7 social impact); originals tetap di `refs/`
- `refs/.../Foto Logo Anak Perusahaan/` — 6 file `1.png`–`6.png` diganti nama menjadi `1_karyarotan.png`, `2_ratanexport.png`, dst. (sesuai slug)

### Fase 2 — `/api/contact` (selesai, belum commit)
- `app/api/contact/route.ts` **baru** — POST handler (validasi strict → cek SMTP → kirim via nodemailer Gmail SMTP)
- `package.json` / `package-lock.json` — tambah `nodemailer@9.0.5`, `@types/nodemailer@8.0.1`
- `.env.local` — tambah `SMTP_USER` (terisi) + `SMTP_PASS` (masih kosong, menunggu App Password)

---

## 5. Current Data / Content State

### Companies

| # | Perusahaan | Slug | Industry | ID Positioning (card) | EN Positioning (card) | Highlights | Services |
|---|-----------|------|----------|----------------------|----------------------|------------|----------|
| 1 | Karya Rotan Indonesia | `karya-rotan-indonesia` | Rattan | Merancang & memproduksi furniture, lampu, produk interior rotan custom untuk hotel, vila, restoran, ruang komersial | Designing and manufacturing custom rattan furniture, lighting, and interior products for hotels, villas, restaurants, and commercial spaces | 3 items ✅ | 4 items ✅ |
| 2 | Rattan Export House Indonesia | `rattan-export-house-indonesia` | Rattan Export | Aggregator ekspor end-to-end produk rotan Indonesia, bahan baku hingga produk jadi | End-to-end export aggregator specializing in Indonesian rattan products, from raw materials and semi-finished components to finished furniture and home décor | 3 items ✅ | 4 items ✅ |
| 3 | Kriya Kayu Nusantara | `kriya-kayu-nusantara` | Woodcraft | Penyedia produk kayu dari kerajinan hingga furnitur kustom | Creating handcrafted wooden products ranging from artisan pieces to custom furniture for hotels, restaurants, and commercial projects | 3 items ✅ | 4 items ✅ |
| 4 | Nada Upacara Bali | `nada-upacara-bali` | Cultural & Ceremony | Pertunjukan budaya dan layanan upacara adat Bali yang autentik | Providing authentic Balinese cultural performances and ceremonial services for communities, the hospitality industry, and event organizers | 3 items ✅ | 4 items ✅ |
| 5 | Bali Menari Academy | `bali-menari-academy` | Performing Arts | Kelas tari tradisional dan modern melalui Joyful Learning | Traditional and modern dance classes for children and adults through a Joyful Learning approach | ⚠️ **KOSONG** (`highlights: []`) | 1 item |
| 6 | Niaga Rasa Indonesia | `niaga-rasa-indonesia` | Agricultural Export | Perusahaan ekspor menghubungkan produk pertanian Indonesia dengan pasar domestik dan internasional | An export company connecting Indonesia's agricultural products with domestic and international markets | ⚠️ **KOSONG** (`highlights: []`) | ⚠️ **KOSONG** (`services: []`) |

> ⚠️ Catatan: `bali-menari-academy` dan `niaga-rasa-indonesia` punya `highlights: []` dan/atau `services: []`. Bagian "Keunggulan Kami" di halaman detail mereka akan kosong. Copy untuk mereka belum lengkap di source code (belum ada di PDF atau belum diberikan).

### Social Impact

**Source code:**
- `app/page.tsx` mengambil data dari `getSocialImpacts()` (Notion, filter Status='Published', sort by Order ASC)
- `SocialImpactSection.tsx` menampilkan data dari Notion; fallback jika kosong: 3 item hardcoded
- Notion properties yang digunakan: `Title` (title), `Title EN` (rich_text), `Description ID` (rich_text), `Description EN` (rich_text), `Category ID` (rich_text), `Category EN` (rich_text), `Cover` (url/files), `Order` (number), `Status` (select)

**Verified Notion state** (query read-only 2026-08-09 — **setelah database diupdate**):

| Order | Title (ID) | Title (EN) | Category ID | Category EN | Status | Cover |
|-------|-----------|------------|-------------|-------------|--------|-------|
| 1 | Pemberdayaan Pengrajin Lokal | Empowering Local Artisans | Community Empowerment | Community Empowerment | ✅ Published | ❌ Tidak ada |
| 2 | Pelestarian Seni Bali | Preserving Balinese Arts | Budaya & Warisan | Culture & Heritage | ✅ Published | ❌ Tidak ada |
| 3 | Pemberdayaan Seniman Muda | Empowering Young Artists | Budaya & Warisan | Culture & Heritage | ✅ Published | ❌ Tidak ada |
| 4 | Pelatihan Wirausaha bagi Komunitas Lokal | Entrepreneurship Training for Local Communities | Community Empowerment | Community Empowerment | ✅ Published | ❌ Tidak ada |
| 5 | Mentorship Mahasiswa Bali melalui Program Internship | Mentoring University Students Through Internship Programs | Education & Youth Development | Education & Youth Development | ✅ Published | ❌ Tidak ada |
| 6 | Berbagi Keceriaan di Panti Asuhan | Sharing Joy with Children in Orphanages | Community Empowerment | Community Empowerment | ✅ Published | ❌ Tidak ada |
| 7 | Pemeriksaan Kesehatan bagi Lansia di Panti Jompo | Health Check Programs for Senior Citizens | Health & Well-Being | Health & Well-Being | ✅ Published | ❌ Tidak ada |

**Semua 7 program dari PDF sudah ada di Notion dengan Status='Published' dan Order=1–7.** Deskripsi ID dan EN terisi. Karena Status='Published', `getSocialImpacts()` mengembalikan 7 item → **website menampilkan data Notion** (bukan fallback hardcoded). Terverifikasi via dev server: 7/7 judul ID dan 7/7 judul EN tampil di homepage, fallback "Program Lingkungan Berkelanjutan" tidak muncul.

**Fallback di code** (SocialImpactSection.tsx — hanya dipakai jika Notion kosong):
1. Pemberdayaan Pengrajin Lokal / Local Artisan Empowerment
2. Pelestarian Seni Budaya Bali / Preservation of Balinese Arts
3. Program Lingkungan Berkelanjutan / Sustainable Environment Program ← ⚠️ **Tidak ada di PDF 7 program** (non-aktif selama Notion terisi)

**Cover image:** Cover di Notion masih kosong untuk semua 7 item, tapi sekarang **tidak lagi render placeholder**. `SocialImpactSection.tsx` punya fallback lokal `localCovers` yang dipetakan berdasarkan judul program → file `public/images/social/*.jpg`. Website menampilkan 7 foto kegiatan dari aset lokal. **Prioritas render:** 1) `cover` dari Notion jika ada → 2) fallback lokal `localCovers[titleId]` → 3) placeholder "[ Foto Kegiatan ]" (hanya jika judul tidak terpetakan). Data Notion tidak diubah.

**Catatan minor:** Category EN item #3 (Pemberdayaan Seniman Muda) punya leading space (`" Culture & Heritage"`) di Notion — kosmetik saja, tidak mempengaruhi render.

### Blog

**Verified Notion state** (2 row, keduanya Published):

| Title | Slug | Status | Cover |
|-------|------|--------|-------|
| Artikel Pertama Warma Heritage Group | artikel-pertama | Published | ✅ Ada |
| Artikel Kedua Warma Heritage Group | artikel-kedua | Published | ✅ Ada |

Title EN kosong untuk kedua post → komponen fallback ke Title (ID).

---

## 6. Verification Status

Hasil verification 2026-08-09. **Terverifikasi ulang setelah integrasi aset foto** (tsc + build + cek placeholder + cek asset path): semua PASS.

### `npx tsc --noEmit`
**✅ PASS** — exit code 0, tanpa error

### `npm run build`
**✅ PASS** — Next.js 16.2.9 (Turbopack), compiled successfully

```
Route (app)            Revalidate  Expire
┌ ○ /                          1m      1y
├ ○ /_not-found
├ ƒ /api/contact
├ ○ /blog                      1m      1y
├ ƒ /blog/[slug]
├ ƒ /companies/[slug]
├ ○ /robots.txt
└ ○ /sitemap.xml
```

Static pages: `/`, `/blog`, `/_not-found`, `/robots.txt`, `/sitemap.xml`
Dynamic pages: `/api/contact`, `/blog/[slug]`, `/companies/[slug]`

Catatan: Build berhasil dengan 8 routes, semua komponen tercompile tanpa error.

### Verifikasi `/api/contact` (production server port 3100, 2026-08-09)

| Skenario | Status | Response |
|---|---|---|
| GET (method tak didukung) | ✅ | `405` (auto Next) |
| POST invalid JSON | ✅ | `400` `{"error":"Invalid JSON body."}` |
| POST field kosong / email invalid | ✅ | `400` + daftar error validasi |
| POST body valid, SMTP belum config | ✅ | `500` guard `{"error":"Email belum dikonfigurasi."}` (tidak ada email dicoba kirim) |
| POST → kirim email nyata | ⛔ belum dites | butuh `SMTP_PASS` diisi user |

Fix yang ditemukan saat test: urutan handler awalnya cek SMTP **sebelum** validasi → validasi tidak bisa diverifikasi saat email belum dikonfigurasi. Diubah jadi **parse JSON → validasi → cek SMTP → kirim** (lihat Section 9).

---

## 7. Pending Tasks

Checklist berdasarkan kondisi project aktual (urutan prioritas):

- [ ] **Push commit ke origin/main** — `main` ahead of origin, belum di-push
- [x] **Upload aset foto ke `public/images/`** ✅ — 18 foto dari `refs/` sudah dicopy ke `public/images/` (hero, about, 3 founder, 6 logo perusahaan, 7 foto social impact). Asli di `refs/` tidak dihapus.
- [x] **Replace placeholder foto di landing page & detail pages** ✅ — Hero, About, Founders (3), Companies (6), CompanyDetail hero+about (6×2), SocialImpact (7) sudah pakai `next/image`. **Tersisa:** galeri `[ Foto 1-4 ]` di CompanyDetailClient (tidak ada aset produk).
- [ ] **Isi `SMTP_PASS` (App Password Google) di `.env.local`** — route `/api/contact` sudah dibangun & terverifikasi; satu-satunya yang menghalangi pengiriman aktual adalah App Password. Cara: Google Account → Security → 2-Step Verification → App passwords. Setelah diisi, test kirim nyata.
- [x] **Implement `/api/contact`** ✅ — route `app/api/contact/route.ts` dibuat (validasi strict + nodemailer Gmail SMTP), `nodemailer` + `@types/nodemailer` ditambahkan. tsc PASS, build PASS, semua response terverifikasi (405/400/500/guard). [detail Section 2 → API Routes](#api-routes)
- [ ] **Lengkapi highlights/services untuk Bali Menari Academy & Niaga Rasa Indonesia** — kosong di company detail pages
- [ ] **EN content blog** — Title EN kosong di kedua post Notion (artikel-pertama, artikel-kedua)
- [ ] **Sinkronkan fallback SocialImpactSection** *(opsional, prioritas rendah)* — fallback punya "Program Lingkungan Berkelanjutan" yang bukan bagian dari 7 program PDF; hanya terlihat jika Notion dikosongkan
- [ ] **Update README.md** — masih menyebut Next.js 15 (aktual 16.2.9), Playfair Display (aktual Sorts Mill Goudy), fase SDLC lama, status "In Development", struktur halaman belum termasuk blog detail & company detail
- [ ] **Bersihkan public/** — file default Next.js (file.svg, globe.svg, next.svg, vercel.svg, window.svg) tidak dipakai
- [ ] **Final QA** — responsive testing, cek semua link & anchor, test bilingual toggle, test blog + company detail pages
- [ ] **Production deployment** — push, deploy ke Vercel, verifikasi domain

---

## 8. Known Issues / Notes

- **`/api/contact` ada, tapi menunggu `SMTP_PASS`** — Route handler selesai (validasi strict + Gmail SMTP via nodemailer). Karena `SMTP_PASS` masih kosong, route balas `500 Email belum dikonfigurasi` sebagai guard — tidak ada email yang dicoba kirim. User harus generate Google App Password dan mengisinya di `.env.local`.
- **npm config `omit=dev` di mesin dev** — devDependencies (typescript, eslint, tailwindcss, @types/react, dll.) tidak terpasang oleh `npm install` biasa; ditemukan saat menjalankan `npx tsc --noEmit`. Sudah diatasi dengan `npm install --include=dev`. Dev server lama yang berjalan sebelum itu akan error (`Cannot find module 'enhanced-resolve'`) sampai di-restart.
- **Social Impact: Cover di Notion masih kosong, tapi ada fallback lokal** — 7 program sudah Published & tampil di website. Cover Notion kosong → dipakai fallback lokal `localCovers` di `SocialImpactSection.tsx` (foto dari `public/images/social/*.jpg`, dipetakan per judul). Jika nanti Cover diisi di Notion, Cover tersebut akan diprioritaskan. [detail di Section 5](#social-impact)
- **Fallback SocialImpactSection tidak sinkron dengan PDF** — Fallback punya item "Program Lingkungan Berkelanjutan" yang bukan bagian dari 7 program Social Impact di PDF. Deskripsi fallback juga versi lama/generic. **Tidak terlihat saat ini** karena Notion terisi 7 item (fallback hanya dipakai jika Notion kosong).
- **Blog posts ID-only** — Kedua post Notion tidak punya Title EN; komponen fallback ke Title (ID-only). EN blog content belum ada.
- **`.env.local` punya env vars tidak dipakai** — `OPENAI_API_KEY` dan `OPENAI_BASE_URL` (localhost:20128) ada di .env.local tapi tidak digunakan oleh kode. Sisa config sesi sebelumnya. Jangan diasumsikan terkait project.
- **README belum sinkron** — Menyebut Next.js 15 (aktual 16.2.9), Playfair Display (aktual Sorts Mill Goudy), SDLC fase "Design sedang berjalan", struktur halaman tidak termasuk company detail & blog detail pages, badge status "In Development".
- **metadataBase & deployment** — Semua URL (sitemap, robots, OG, metadataBase) mengarah ke `https://warma-heritage-group.vercel.app`. Perlu dipastikan ini adalah domain produksi akhir, atau diupdate jika custom domain digunakan.
- **Company detail pages untuk Bali Menari Academy & Niaga Rasa Indonesia** — `highlights: []` dan/atau `services: []` → bagian "Keunggulan Kami" dan "Apa yang Kami Tawarkan" akan kosong di halaman detail mereka. Copy untuk mereka mungkin belum lengkap dari sumber (PDF).
- **Galeri company detail masih placeholder** — `[ Foto 1-4 ]` di CompanyDetailClient.tsx (bagian Galeri/Portfolio) masih placeholder karena tidak ada foto produk di `refs/`. Tidak dipaksakan mapping. Aset galeri diperlukan sebelum bagian ini diisi.
- **Punycode deprecation warning** — Muncul saat menjalankan script Node.js dengan `@notionhq/client`. Warning dari dependency, bukan error, tidak mempengaruhi fungsionalitas.
- **`feature/copywriting-update` branch** — Ada branch local `feature/copywriting-update` di remote yang mungkin terkait copywriting changes. Perlu dipastikan sudah ter-merge atau tidak.
- **Brand logo** — `public/Logo_clear.png` digunakan sebagai favicon, apple-touch-icon, OG image, dan di beberapa komponen. Belum ada versi lain (dark/light). Logo di `refs/.../Foto Logo Anak Perusahaan/1_karyarotan.png` dll. adalah logo **anak perusahaan** (sudah dipetakan), bukan logo WHG.

---

## 9. Important Decisions

- **Copywriting sumber: PDF** — Copy untuk perusahaan dan social impact berasal dari PDF "Revisi Copywriting WHG Website.pdf". Jangan mengarang copy yang tidak tersedia di PDF atau source code yang ada.
- **Social Impact pakai Notion sebagai CMS** — Data diambil dari Notion via `getSocialImpacts()`, bukan hardcode. Fallback hanya cadangan. Update dilakukan di Notion UI, bukan di code.
- **Cover Social Impact: Notion prioritas, fallback lokal sebagai cadangan** — Karena Cover di Notion kosong, `SocialImpactSection.tsx` memakai `localCovers` (map judul → `public/images/social/*.jpg`). Jika Cover nanti diisi di Notion, otomatis menang (tanpa ubah code). Jangan mengubah data Notion.
- **Semua foto lokal pakai `next/image`** — komponen `Image` dengan `fill` + `objectFit` (cover untuk foto, contain untuk logo), `sizes` per layout. `preload` dipakai hanya untuk hero (LCP). `priority` deprecated di Next 16 → tidak dipakai.
- **Jangan memaksakan mapping foto yang tidak jelas** — Galeri `[ Foto 1-4 ]` company detail dibiarkan placeholder karena tidak ada aset produk; tidak dibuatkan aset atau dipakai logo sebagai pengganti.
- **Jangan membuat API workaround untuk update Notion** — Perubahan data Notion dilakukan manual di Notion UI. Tidak dibangun backend/API untuk programmatically update Notion tanpa persetujuan.
- **Bahasa ganda ID/EN** — Toggle ID/EN via `useLang` hook + localStorage. Semua section mendukung dua bahasa, kecuali blog (ID-only).
- **Slug perusahaan: kebab-case** — `bali-menari` diubah menjadi `bali-menari-academy`. URL: `/companies/{slug}`.
- **Email kontak: Gmail SMTP (dipilih user, 2026-08-09)** — `/api/contact` memakai `nodemailer` + SMTP `smtp.gmail.com:587` dengan akun `warmaheritagegroup@gmail.com`. Dua env var baru (`SMTP_USER`, `SMTP_PASS`) ditambahkan atas persetujuan user. `SMTP_PASS` = Google App Password (2-Step Verification). Tidak ada provider/kredensial lain yang di-fabricate; sebelum persetujuan, ditemukan tidak ada mekanisme email sama sekali → dilaporkan & dihentikan dulu.
- **Validasi sebelum SMTP check di `/api/contact`** — urutan handler: parse JSON → validasi field (400) → cek SMTP config (500) → kirim. Memastikan validasi tetap bisa diverifikasi walau email belum dikonfigurasi.
- **CSS grey scale custom theme** — Warnabya menggunakan custom `@theme` di globals.css: grey 50-900. Bukan Tailwind default. Warna brand: `#141414` (primary), `#FAFAFA` (bg), `#F5F5F5` (surface).
- **Deployment: Vercel** — `metadataBase` diatur ke `https://warma-heritage-group.vercel.app`.
- **Notion revalidate 60 detik** — ISR (Incremental Static Regeneration) dengan `revalidate = 60`.
- **Jangan ubah file lain saat checkpoint** — Satu-satunya file yang dibuat/diubah dalam tugas ini adalah `PROJECT_STATUS.md`.

---

## 10. Files Changed Recently

Daftar file penting yang berubah di commit terakhir (`eede18c`, 2026-08-08):

| File | Keterangan |
|------|-----------|
| `app/components/CompaniesSection.tsx` | Update copywriting 6 perusahaan sesuai PDF, ubah Bali Menari → Bali Menari Academy |
| `app/companies/[slug]/page.tsx` | Update tagline, description, highlights, services untuk semua 6 perusahaan |
| `app/lib/constants.ts` | Update email (`warmaheritagegroup@gmail.com`), alamat (Jalan Sekar Tunjung XV) |
| `app/components/CTASection.tsx` | Refactor, tambah ContactForm integration |
| `app/components/ContactForm.tsx` | **Baru** — form UI lengkap (name, email, company, subject, message) |
| `app/components/JsonLd.tsx` | Fix: ubah "subOrganisation" → "subOrganization" |
| `app/not-found.tsx` | Fix: styling, tambah WA link |
| `app/error.tsx` | **Baru** — global error boundary |
| `app/blog/[slug]/loading.tsx` | **Baru** — skeleton untuk blog detail |
| `app/blog/[slug]/error.tsx` | **Baru** — error boundary untuk blog detail |
| `app/blog/loading.tsx` | **Baru** — skeleton untuk blog list |
| `app/blog/error.tsx` | **Baru** — error boundary untuk blog list |
| `app/companies/[slug]/loading.tsx` | **Baru** — skeleton untuk company detail |
| `app/companies/[slug]/error.tsx` | **Baru** — error boundary untuk company detail |
| `app/blog/[slug]/BlogDetailClient.tsx` | Refactor: share buttons (WA, Copy Link, X), meta layout |
| `app/sitemap.ts` | Tambah company URLs ke sitemap |
| `README.md` | Perbarui sebagian (belum sinkron) |
| `pdf_text.txt` | **Baru** — hasil ekstraksi teks PDF copywriting |
| `refs/` (folder baru) | 19 file: foto founder (3), logo perusahaan (6), foto social impact (7), foto tentang kami (1), hero photo (1), PDF copywriting (1) |
| `app/components/BlogSkeleton.tsx` | **Dihapus** — diganti blog-specific loading.tsx files |
| `app/components/ui/PlaceholderImage.tsx` | **Dihapus** |
| `app/components/ui/SectionHeader.tsx` | **Dihapus** |
| `app/components/ui/WhatsAppButton.tsx` | **Dihapus** |

Perubahan **belum di-commit** (setelah `eede18c`, 2026-08-09):

| File | Keterangan |
|------|-----------|
| `app/api/contact/route.ts` | **Baru** — POST `/api/contact`: validasi strict + kirim email Gmail SMTP (nodemailer) |
| `app/components/HeroSection.tsx` | Integrasi foto hero via `next/image` (`preload` untuk LCP) |
| `app/components/AboutSection.tsx` | Integrasi foto tentang kami via `next/image` |
| `app/components/FounderSection.tsx` | Integrasi 3 foto founder via `next/image` |
| `app/components/CompaniesSection.tsx` | Integrasi 6 logo perusahaan via `next/image` |
| `app/companies/[slug]/CompanyDetailClient.tsx` | Integrasi logo di Hero & About company detail |
| `app/components/SocialImpactSection.tsx` | Fallback lokal `localCovers` (judul → foto kegiatan) |
| `package.json` / `package-lock.json` | Tambah `nodemailer`, `@types/nodemailer` |
| `.env.local` | Tambah `SMTP_USER`, `SMTP_PASS` (kosong) |
| `public/images/` | **Baru** — 18 aset foto (hero, about, founders/3, companies/6, social/7) |
| `PROJECT_STATUS.md` | Dokumen ini — update berkelanjutan |

---

## 11. Next Step

**Isi `SMTP_PASS` (Google App Password) di `.env.local` lalu test kirim nyata.** Route `/api/contact` sudah dibangun & semua response terverifikasi (405/400/500/guard). Yang tersisa: user generate App Password dari Google Account → isi `SMTP_PASS` → test kirim via form. Petunjuk: Google Account → Security → 2-Step Verification → App passwords.

**Setelah itu (prioritas berikutnya, lihat Section 7):**
1. **Push commit ke origin/main** — `main` masih ahead, belum di-push
2. **Lengkapi highlights/services** untuk Bali Menari Academy & Niaga Rasa Indonesia — kosong di company detail pages
3. **Aset galeri company detail** — `[ Foto 1-4 ]` masih placeholder; butuh foto produk dari client sebelum diisi
4. **EN content blog** — Title EN kosong di kedua post Notion
5. **Update README.md** — masih menyebut Next.js 15, Playfair Display, SDLC lama
6. **Final QA + Production deployment** — push, deploy ke Vercel, verifikasi domain

---

## 12. Resume Prompt

```
Baca PROJECT_STATUS.md di root project. Periksa kondisi source code saat ini (git status, file). 
Lanjutkan dari bagian "Next Step" — yaitu isi SMTP_PASS (App Password Gmail) lalu test kirim email nyata 
via /api/contact. Route handler sudah selesai dan terverifikasi; jangan ulang pembuatannya. 
Catatan: npm config punya omit=dev → devDependencies tidak terpasang otomatis; pakai `npm install --include=dev` 
jika perlu. Dev server lama harus di-restart agar memuat node_modules yang lengkap. 
Jangan ulang pekerjaan yang sudah DONE. Jangan mengarang informasi. Setelah perubahan apapun, 
jalankan tsc --noEmit dan npm run build untuk verifikasi. Jika ada pertanyaan tentang data, rujuk 
ke bagian "Current Data / Content State" di PROJECT_STATUS.md — semua data Notion sudah terverifikasi 
dari query langsung, bukan asumsi percakapan. Aset foto sudah terintegrasi ke public/images/.
```

---

*Document generated 2026-08-09. Based on source code inspection, git history, and read-only Notion API queries.*
