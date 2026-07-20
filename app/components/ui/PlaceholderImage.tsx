interface PlaceholderImageProps {
  label?: string;
  className?: string;
  aspectClassName?: string;
}

export default function PlaceholderImage({
  label = '[ Foto ]',
  className = '',
  aspectClassName = 'aspect-square',
}: PlaceholderImageProps) {
  return (
    <div className={`w-full ${aspectClassName} bg-gray-100 flex items-center justify-center ${className}`}>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}