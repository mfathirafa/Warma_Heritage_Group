# Warma Heritage Group — Official Website

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4)

Website resmi **Warma Heritage Group**, sebuah holding company yang membawahi 6 anak perusahaan berbasis warisan budaya Indonesia. Dibangun sebagai single long-page landing page dengan dukungan dual language (Indonesia & English) dan blog terpisah untuk SEO.

---

## Anak Perusahaan

| No | Perusahaan | Bidang |
|----|-----------|--------|
| 1 | Karya Rotan Indonesia | Produksi & ekspor produk rotan |
| 2 | Rattan Export House Indonesia | Ekspor rotan ke pasar internasional |
| 3 | Kriya Kayu Nusantara | Kerajinan kayu berbasis kearifan lokal |
| 4 | Nada Upacara Bali | Penyedia kebutuhan upacara adat Bali |
| 5 | Bali Menari | Seni pertunjukan & tari tradisional Bali |
| 6 | Niaga Rasa Indonesia | Kuliner berbasis cita rasa Nusantara |

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Font:** Inter (body) + Playfair Display (heading)
- **Deployment:** Vercel *(coming soon)*

---

## Struktur Halaman

```
/                 → Landing page (single long-page)
  ├── Navbar      → Sticky, dual language toggle ID/EN, anchor scroll
  ├── Hero        → Headline, tagline, CTA WhatsApp
  ├── About       → Profil Warma Heritage Group
  ├── Founder     → Profil Mahotama Warmasuta
  ├── Companies   → 6 anak perusahaan (card grid)
  ├── Services    → Layanan & keunggulan
  ├── Impact      → Social impact & kegiatan sosial
  ├── CTA         → Ajakan kontak via WhatsApp
  └── Footer      → Kontak, alamat, copyright

/blog             → Halaman blog terpisah (untuk SEO)
```

---

## Metodologi Pengembangan

Proyek ini menggunakan **Iterative-Incremental SDLC** dengan 6 fase:

| Fase | Keterangan | Status |
|------|-----------|--------|
| 1. Planning | Requirement & brief | ✅ Selesai |
| 2. Design | Wireframe & design system | 🟡 Sedang berjalan |
| 3. Development | Coding komponen | ⏳ Belum mulai |
| 4. Testing | Responsive & functional test | ⏳ Belum mulai |
| 5. Deployment | Build & deploy ke hosting | ⏳ Belum mulai |
| 6. Maintenance | Monitoring & dokumentasi | ⏳ Belum mulai |

---

## Cara Menjalankan Lokal

```bash
# Clone repo
git clone https://github.com/mfathirafa/Warma_Heritage_Group.git

# Masuk ke folder project
cd Warma_Heritage_Group/warma-heritage-group

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Kontak Perusahaan

- **Email:** WarmaGroup@gmail.com
- **WhatsApp:** +62 812-3966-9880
- **Alamat:** Jalan Tukad Yeh Aya IX No. 90, Denpasar, Bali 80226
- **Director:** Mahotama Warmasuta

---

## Developer

Dikembangkan oleh **Muhammad Fathi Rafa** sebagai bagian dari program Web Developer Internship di Warma Heritage Group (Juli – Oktober 2026).
