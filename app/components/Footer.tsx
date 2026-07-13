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

        {/* Top */}
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
            
            {/* Perbaikan: Menambahkan tag pembuka <a> di sini */}
            <a
              href={`https://wa.me/6281239669880?text=${isId ? 'Halo%20Warma%20Heritage%20Group%2C%20saya%20ingin%20menghubungi%20Anda.' : 'Hello%20Warma%20Heritage%20Group%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20you.'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit mt-2 px-6 py-2 border border-gray-400 text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>

        </div>

        {/* Bottom */}
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