'use client';

type Lang = 'id' | 'en';

interface ServicesSectionProps {
  lang: Lang;
}

const services = [
  {
    id: 'sustainability',
    icon: '🌿',
    titleId: 'Keberlanjutan',
    titleEn: 'Sustainability',
    descId: 'Membangun bisnis dengan pendekatan ramah lingkungan dan berkelanjutan untuk generasi mendatang.',
    descEn: 'Building businesses with an environmentally friendly and sustainable approach for future generations.',
  },
  {
    id: 'heritage',
    icon: '🏛️',
    titleId: 'Warisan Budaya',
    titleEn: 'Cultural Heritage',
    descId: 'Melestarikan dan mengangkat warisan budaya Indonesia melalui ekosistem bisnis yang modern.',
    descEn: 'Preserving and elevating Indonesian cultural heritage through a modern business ecosystem.',
  },
  {
    id: 'integrity',
    icon: '⚖️',
    titleId: 'Integritas',
    titleEn: 'Integrity',
    descId: 'Menjalankan bisnis dengan prinsip kejujuran, transparansi, dan tata kelola yang baik.',
    descEn: 'Running businesses with principles of honesty, transparency, and good governance.',
  },
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const isId = lang === 'id';

  return (
    <section
      id="services"
      className="w-full bg-gray-50 py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {isId ? 'Layanan Kami' : 'Our Services'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isId ? 'Apa yang Kami Lakukan' : 'What We Do'}
          </h2>
        </div>

        {/* 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 p-8 bg-white"
            >
              <span className="text-3xl">{service.icon}</span>
              <h3 className="text-lg font-bold text-gray-900">
                {isId ? service.titleId : service.titleEn}
              </h3>
              <div className="w-8 h-px bg-gray-300" />
              <p className="text-sm text-gray-500 leading-relaxed">
                {isId ? service.descId : service.descEn}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}