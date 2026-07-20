// ===== COMPANY INFO =====
export const COMPANY_NAME = 'Warma Heritage Group';
export const COMPANY_EMAIL = 'WarmaGroup@gmail.com';
export const COMPANY_PHONE = '+62 812-3966-9880';
export const COMPANY_WA = '6281239669880';
export const COMPANY_ADDRESS = 'Jl. Tukad Yeh Aya IX No. 90, Denpasar, Bali 80226';
export const COMPANY_ADDRESS_SHORT = 'Jl. Tukad Yeh Aya IX No. 90, Denpasar, Bali';
export const COMPANY_CITY = 'Denpasar, Bali, Indonesia';
export const COMPANY_SITE = 'https://warma-heritage-group.vercel.app';

// ===== WA MESSAGES =====
export const WA_MESSAGES = {
  general: {
    id: 'Halo%20Warma%20Heritage%20Group%2C%20saya%20ingin%20menghubungi%20Anda.',
    en: 'Hello%20Warma%20Heritage%20Group%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20you.',
  },
  partnership: {
    id: 'Halo%20Warma%20Heritage%20Group%2C%20saya%20tertarik%20untuk%20bermitra%20dengan%20perusahaan%20Anda.%20Boleh%20saya%20tahu%20lebih%20lanjut%3F',
    en: 'Hello%20Warma%20Heritage%20Group%2C%20I%20am%20interested%20in%20partnering%20with%20your%20company.%20Could%20you%20tell%20me%20more%3F',
  },
} as const;

// ===== NAV LINKS =====
export const NAV_LINKS = [
  { id: 'about', labelId: 'Tentang Kami', labelEn: 'About Us' },
  { id: 'founder', labelId: 'Pendiri', labelEn: 'Founder' },
  { id: 'companies', labelId: 'Perusahaan', labelEn: 'Companies' },
  { id: 'services', labelId: 'Layanan', labelEn: 'Services' },
  { id: 'impact', labelId: 'Dampak Sosial', labelEn: 'Social Impact' },
  { id: 'contact', labelId: 'Kontak', labelEn: 'Contact' },
  { id: 'blog', labelId: 'Blog', labelEn: 'Blog' },
] as const;

// ===== TYPES =====
export type Lang = 'id' | 'en';
export type NavLinkId = typeof NAV_LINKS[number]['id'];