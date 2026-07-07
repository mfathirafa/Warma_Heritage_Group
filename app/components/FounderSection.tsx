'use client';

type Lang = 'id' | 'en';

interface FounderSectionProps {
  lang: Lang;
}

const content = {
  id: {
    label: 'Pendiri',
    name: 'Mahotama Warmasuta',
    title: 'Director, Warma Heritage Group',
    bio: 'Mahotama Warmasuta adalah pendiri sekaligus Direktur Warma Heritage Group. Dengan visi membangun ekosistem bisnis yang sehat dan berdampak, beliau mendirikan Warma Heritage Group sebagai wadah bagi perusahaan-perusahaan yang mengangkat warisan dan budaya Indonesia ke panggung yang lebih luas.',
  },
  en: {
    label: 'Founder',
    name: 'Mahotama Warmasuta',
    title: 'Director, Warma Heritage Group',
    bio: 'Mahotama Warmasuta is the founder and Director of Warma Heritage Group. With a vision to build a healthy and impactful business ecosystem, he established Warma Heritage Group as a platform for companies that bring Indonesian heritage and culture to a broader stage.',
  },
};

export default function FounderSection({ lang }: FounderSectionProps) {
  const t = content[lang];

  return (
    <section
      id="founder"
      className="w-full bg-gray-50 py-24 px-8"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Foto kiri — persegi */}
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">[ Foto Founder ]</p>
        </div>

        {/* Teks kanan */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">
            {t.label}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {t.name}
          </h2>
          <p className="text-sm tracking-wide text-gray-400 uppercase">
            {t.title}
          </p>
          <div className="w-12 h-px bg-gray-300" />
          <p className="text-base text-gray-500 leading-relaxed">
            {t.bio}
          </p>
        </div>

      </div>
    </section>
  );
}