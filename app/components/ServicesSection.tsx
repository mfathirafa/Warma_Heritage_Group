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
        icon: '🏢',
        title: 'Membangun Bisnis',
        desc: 'Kami mendirikan dan mengembangkan perusahaan dengan fondasi yang kuat, arah yang jelas, serta visi jangka panjang untuk mencapai pertumbuhan yang berkelanjutan.',
      },
      {
        id: 'partner',
        icon: '🤝',
        title: 'Membangun Kemitraan',
        desc: 'Kami membangun hubungan yang saling menguatkan dengan pelanggan, mitra, pengrajin, komunitas, dan para pemangku kepentingan untuk menciptakan kolaborasi yang berkelanjutan.',
      },
      {
        id: 'connect',
        icon: '🌏',
        title: 'Menghubungkan Potensi Lokal dengan Peluang Global',
        desc: 'Kami menghubungkan budaya, kerajinan, dan potensi kewirausahaan Indonesia dengan peluang di pasar internasional melalui portofolio bisnis yang kami kembangkan.',
      },
      {
        id: 'sustain',
        icon: '🌱',
        title: 'Menciptakan Nilai yang Berkelanjutan',
        desc: 'Kami mendorong pertumbuhan yang bertanggung jawab untuk menghasilkan nilai ekonomi, sosial, dan budaya yang memberikan manfaat jangka panjang bagi perusahaan, masyarakat, dan generasi mendatang.',
      },
    ],
  },
  en: {
    label: 'What We Do',
    headline: 'Building Business With Purpose',
    services: [
      {
        id: 'build',
        icon: '🏢',
        title: 'Build Businesses',
        desc: 'We establish and grow businesses with strong foundations, clear direction, and a long-term vision for sustainable success.',
      },
      {
        id: 'partner',
        icon: '🤝',
        title: 'Empower Partnerships',
        desc: 'We foster meaningful relationships with customers, partners, artisans, communities, and stakeholders to create shared value and lasting collaboration.',
      },
      {
        id: 'connect',
        icon: '🌏',
        title: 'Connect Local to Global',
        desc: 'We connect Indonesia\'s culture, craftsmanship, and entrepreneurial potential with opportunities in global markets through our diverse business portfolio.',
      },
      {
        id: 'sustain',
        icon: '🌱',
        title: 'Create Sustainable Value',
        desc: 'We pursue responsible growth that generates long-term economic, social, and cultural value for our businesses, communities, and future generations.',
      },
    ],
  },
};

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const t = content[lang];

  return (
    <section
      id="services"
      className="w-full bg-gray-50 py-24 px-8"
    >
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
          {t.services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 p-8 bg-white"
            >
              <span className="text-3xl">{service.icon}</span>
              <h3 className="text-base font-bold text-gray-900 leading-snug">
                {service.title}
              </h3>
              <div className="w-8 h-px bg-gray-300" />
              <p className="text-sm text-gray-500 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}