'use client';

type Lang = 'id' | 'en';

interface FounderSectionProps {
  lang: Lang;
}

const founders = {
  id: [
    {
      id: 'mahotama',
      name: 'I Made Mahotama Warmasuta',
      title: 'Founder & Group Managing Director',
      bio: 'Mahotama mendirikan Warma Heritage Group dengan visi membangun bisnis berkelanjutan yang terinspirasi oleh warisan Indonesia. Sebagai Group Managing Director, ia memimpin arah strategis jangka panjang, pengembangan bisnis, dan berbagai inisiatif pertumbuhan grup, sekaligus mendorong kewirausahaan yang bertanggung jawab serta kemitraan yang bermakna.',
    },
    {
      id: 'warta',
      name: 'I Wayan Warta',
      title: 'Founder & Commissioner',
      bio: 'Berbekal pengalaman kepemimpinan selama puluhan tahun, khususnya di industri perhotelan, beliau menghadirkan pendekatan yang disiplin, konsisten, dan berorientasi pada tata kelola yang baik. Kepemimpinannya didasarkan pada integritas, akuntabilitas, dan komitmen terhadap keunggulan operasional.',
    },
    {
      id: 'masyuni',
      name: 'Ni Nyoman Sri Masyuni',
      title: 'Founder & Commissioner',
      bio: 'Dengan pengalaman bertahun-tahun dalam mengelola operasional dan membangun hubungan dengan berbagai pihak, beliau membawa perspektif yang berpusat pada manusia dalam setiap langkah perusahaan. Beliau meyakini bahwa bisnis yang bertahan lama dibangun di atas kepercayaan, kolaborasi, dan hubungan yang tulus.',
    },
  ],
  en: [
    {
      id: 'mahotama',
      name: 'I Made Mahotama Warmasuta',
      title: 'Founder & Group Managing Director',
      bio: 'Mahotama founded Warma Heritage Group with a vision to build sustainable businesses inspired by Indonesian heritage. As Group Managing Director, he leads the Group\'s long-term strategy, business development, and growth initiatives while fostering responsible entrepreneurship and meaningful partnerships.',
    },
    {
      id: 'warta',
      name: 'I Wayan Warta',
      title: 'Founder & Commissioner',
      bio: 'With decades of leadership experience, particularly in the hospitality sector, he brings a steady and disciplined approach to building organizations. His leadership is grounded in integrity, accountability, and a commitment to operational excellence.',
    },
    {
      id: 'masyuni',
      name: 'Ni Nyoman Sri Masyuni',
      title: 'Founder & Commissioner',
      bio: 'With years of experience working closely with people and operations, she brings a thoughtful and people-centered perspective to the Group. She believes lasting businesses are built on trust, collaboration, and genuine relationships.',
    },
  ],
};

export default function FounderSection({ lang }: FounderSectionProps) {
  const list = founders[lang];

  return (
    <section
      id="founder"
      className="w-full bg-gray-50 py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-3">
            {lang === 'id' ? 'Pendiri' : 'Our Founders'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {lang === 'id' ? 'Bertemu dengan Para Pendiri' : 'Meet the Founders'}
          </h2>
        </div>

        {/* Grid 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((founder) => (
            <div key={founder.id} className="flex flex-col gap-5">

              {/* Foto — persegi */}
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400 text-xs">[ Foto ]</p>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {founder.name}
                </h3>
                <p className="text-xs tracking-wide text-gray-400 uppercase">
                  {founder.title}
                </p>
                <div className="w-8 h-px bg-gray-300 my-1" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {founder.bio}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}