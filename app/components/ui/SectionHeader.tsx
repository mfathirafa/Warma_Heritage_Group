interface SectionHeaderProps {
  label: string;
  headline: string;
  className?: string;
  labelClass?: string;
  headlineClass?: string;
}

export default function SectionHeader({
  label,
  headline,
  className = 'mb-16',
  labelClass = '',
  headlineClass = '',
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <p className={`text-xs tracking-[0.2em] text-gray-400 uppercase mb-3 ${labelClass}`}>
        {label}
      </p>
      <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${headlineClass}`}>
        {headline}
      </h2>
    </div>
  );
}