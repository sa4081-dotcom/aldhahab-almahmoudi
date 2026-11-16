import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3ECE0] via-[#EAE0CF] to-[#DFD0B5] text-[#6E5326] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-7 h-7 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="text-sm font-medium text-[#4A371A] line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
