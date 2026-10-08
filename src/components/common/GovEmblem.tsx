import React from 'react';

interface GovEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  showSealBorder?: boolean;
  className?: string;
}

export const GovEmblem: React.FC<GovEmblemProps> = ({
  size = 'md',
  showSealBorder = true,
  className = '',
}) => {
  const pixelSize = size === 'sm' ? 36 : size === 'lg' ? 56 : 44;

  // 24 spokes of the Ashoka Chakra (every 15 degrees)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label="Government inspired emblem"
    >
      <svg
        viewBox="0 0 100 100"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full drop-shadow-2xs"
      >
        <defs>
          <radialGradient id="emblemGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="70%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
          <linearGradient id="deepNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b387b" />
            <stop offset="100%" stopColor="#082855" />
          </linearGradient>
        </defs>

        {showSealBorder && (
          <>
            {/* Outer Decorative Ring */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="url(#emblemGold)"
              stroke="#0b387b"
              strokeWidth="2.5"
            />
            {/* Inner Border Ring */}
            <circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke="#d97706"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </>
        )}

        {/* Ashoka Chakra Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r={showSealBorder ? '34' : '46'}
          fill="#ffffff"
          stroke="#0b387b"
          strokeWidth="3"
        />

        {/* Chakra Hub (Center circle) */}
        <circle cx="50" cy="50" r="7" fill="#0b387b" />
        <circle cx="50" cy="50" r="3" fill="#ffffff" />

        {/* 24 Spokes */}
        {spokes.map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="50"
            x2="50"
            y2={showSealBorder ? '17' : '5'}
            stroke="#0b387b"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}

        {/* Subtle rim bead accents */}
        {spokes.map((deg) => (
          <circle
            key={`bead-${deg}`}
            cx="50"
            cy={showSealBorder ? '18' : '7'}
            r="1"
            fill="#0b387b"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
};
