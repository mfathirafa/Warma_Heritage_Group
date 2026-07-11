'use client';

type Lang = 'id' | 'en';

interface FooterProps {
  lang: Lang;
}

const navLinks = [
  { id: 'about', labelId: 'Tentang Kami', labelEn: 'About Us' },
  { id: 'founder', labelId: 'Pendiri', labelEn: 'Founders' },
  { id: 'companies', labelId: 'Perusahaan', labelEn: 'Companies' },
  { id: 'services', labelId: 'Layanan', labelEn: 'Services' },
  { id: 'impact', labelId: 'Dampak Sosial', labelEn: 'Social Impact' },
  { id: 'contact', labelId: 'Kontak', labelEn: 'Contact' },
];

export default function Footer({ lang }: FooterProps) {
  const isId = lang === 'id';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gray-100 py-16 px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Top — Logo + Nav + Kontak */}
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-gray-300">

          {/* Logo & deskripsi */}
          <div className="flex flex-col gap-4 max-w-xs">
            <img
              src="/Logo_clear.png"
              alt="Warma Heritage Group"
              className="w-32"
            />
            <p className="text-sm text-gray-600 leading-relaxed">
              {isId
                ? 'Holding company berbasis warisan budaya Indonesia yang berfokus pada keberlanjutan dan integritas.'
                : 'An Indonesian cultural heritage-based holding company focused on sustainability and integrity.'}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
              {isId ? 'Navigasi' : 'Navigation'}
            </p>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-gray-600 hover:text-gray-900 text-left transition-colors"
              >
                {isId ? link.labelId : link.labelEn}
              </button>
            ))}
          </div>

          {/* Kontak */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
              {isId ? 'Kontak' : 'Contact'}
            </p>
            <p className="text-sm text-gray-600">WarmaGroup@gmail.com</p>
            <p className="text-sm text-gray-600">+62 812-3966-9880</p>
            <p className="text-sm text-gray-600">
              Jl. Tukad Yeh Aya IX No. 90,<br />
              Denpasar, Bali 80226
            </p>
            <button
              onClick={() => window.open('https://wa.me/6281239669880', '_blank')}
              className="w-fit mt-2 px-6 py-2 border border-gray-400 text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              💬 WhatsApp
            </button>
          </div>

        </div>

        {/* Bottom — Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Warma Heritage Group. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Denpasar, Bali, Indonesia
          </p>
        </div>

      </div>
    </footer>
  );
}