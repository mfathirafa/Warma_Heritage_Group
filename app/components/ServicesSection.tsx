'use client';

type Lang = 'id' | 'en';

interface ServicesSectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Apa yang Kami Lakukan',
    headline: 'Membangun Bisnis yang Memiliki Tujuan',
    services: [
      {
        id: 'build',
        titleId: 'Membangun Bisnis',
        descId: 'Kami mendirikan dan mengembangkan perusahaan dengan fondasi yang kuat, arah yang jelas, serta visi jangka panjang untuk mencapai pertumbuhan yang berkelanjutan.',
      },
      {
        id: 'partner',
        titleId: 'Membangun Kemitraan',
        descId: 'Kami membangun hubungan yang saling menguatkan dengan pelanggan, mitra, pengrajin, komunitas, dan para pemangku kepentingan untuk menciptakan kolaborasi yang berkelanjutan.',
      },
      {
        id: 'connect',
        titleId: 'Menghubungkan Potensi Lokal dengan Peluang Global',
        descId: 'Kami menghubungkan budaya, kerajinan, dan potensi kewirausahaan Indonesia dengan peluang di pasar internasional melalui portofolio bisnis yang kami kembangkan.',
      },
      {
        id: 'sustain',
        titleId: 'Menciptakan Nilai yang Berkelanjutan',
        descId: 'Kami mendorong pertumbuhan yang bertanggung jawab untuk menghasilkan nilai ekonomi, sosial, dan budaya yang memberikan manfaat jangka panjang bagi perusahaan, masyarakat, dan generasi mendatang.',
      },
    ],
  },
  en: {
    label: 'What We Do',
    headline: 'Building Business With Purpose',
    services: [
      {
        id: 'build',
        titleEn: 'Build Businesses',
        descEn: 'We establish and grow businesses with strong foundations, clear direction, and a long-term vision for sustainable success.',
      },
      {
        id: 'partner',
        titleEn: 'Empower Partnerships',
        descEn: 'We foster meaningful relationships with customers, partners, artisans, communities, and stakeholders to create shared value and lasting collaboration.',
      },
      {
        id: 'connect',
        titleEn: 'Connect Local to Global',
        descEn: 'We connect Indonesia\'s culture, craftsmanship, and entrepreneurial potential with opportunities in global markets through our diverse business portfolio.',
      },
      {
        id: 'sustain',
        titleEn: 'Create Sustainable Value',
        descEn: 'We pursue responsible growth that generates long-term economic, social, and cultural value for our businesses, communities, and future generations.',
      },
    ],
  },
};

const icons = {
  build: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
    </svg>
  ),
  partner: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
    </svg>
  ),
  connect: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  sustain: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 5.07A10 10 0 0 1 22 12"/><path d="M2 12a10 10 0 0 1 14-9.16"/>
    </svg>
  ),
};

const servicesList = [
  { id: 'build' as const },
  { id: 'partner' as const },
  { id: 'connect' as const },
  { id: 'sustain' as const },
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const isId = lang === 'id';
  const t = isId ? content.id : content.en;

  return (
    <section id="services" className="w-full bg-gray-50 py-24 px-8">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {t.label}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t.headline}
          </h2>
        </div>

        {/* Grid 4 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {servicesList.map((service) => {
            const item = t.services.find(s => s.id === service.id)!;
            const title = isId ? (item as any).titleId : (item as any).titleEn;
            const desc = isId ? (item as any).descId : (item as any).descEn;

            return (
              <div key={service.id} className="flex flex-col gap-4 p-8 bg-white">
                <span className="text-gray-700">
                  {icons[service.id]}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {title}
                </h3>
                <div className="w-8 h-px bg-gray-300" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}