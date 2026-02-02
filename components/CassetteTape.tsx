
import React from 'react';

export const CassetteTape: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-[280px] h-[178px] md:w-[380px] md:h-[240px] animate-float ${className}`}>
    <svg viewBox="0 0 450 285" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="5" y="5" width="440" height="275" stroke="black" strokeWidth="1" fill="#fff7f5" />
      <rect x="20" y="20" width="410" height="245" stroke="black" strokeWidth="0.5" strokeDasharray="4 2" />
      <rect x="45" y="40" width="360" height="140" stroke="black" strokeWidth="1" fill="none" />
      <line x1="45" y1="80" x2="405" y2="80" stroke="black" strokeWidth="0.5" />
      <text x="60" y="65" fontFamily="Space Grotesk" fontSize="12" fontWeight="700" fill="black" letterSpacing="0.4em">REWIND / ANALYTICS</text>
      <text x="390" y="65" fontFamily="Space Grotesk" fontSize="14" fontWeight="700" fill="#fd4747" textAnchor="end">SIDE A</text>
      <line x1="60" y1="105" x2="390" y2="105" stroke="black" strokeWidth="0.5" strokeDasharray="1 3" />
      <line x1="60" y1="125" x2="390" y2="125" stroke="black" strokeWidth="0.5" strokeDasharray="1 3" />
      <line x1="60" y1="145" x2="390" y2="145" stroke="black" strokeWidth="0.5" strokeDasharray="1 3" />
      <rect x="120" y="150" width="210" height="80" stroke="black" strokeWidth="1" fill="#f4f4f4" />
      <g className="animate-reel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="170" cy="190" r="32" stroke="black" strokeWidth="0.5" fill="#fff7f5" />
        <circle cx="170" cy="190" r="10" stroke="#fd4747" strokeWidth="1" />
        <line x1="170" y1="175" x2="170" y2="205" stroke="black" strokeWidth="0.5" />
        <line x1="155" y1="190" x2="185" y2="190" stroke="black" strokeWidth="0.5" />
      </g>
      <g className="animate-reel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="280" cy="190" r="32" stroke="black" strokeWidth="0.5" fill="#fff7f5" />
        <circle cx="280" cy="190" r="10" stroke="#fd4747" strokeWidth="1" />
        <line x1="280" y1="175" x2="280" y2="205" stroke="black" strokeWidth="0.5" />
        <line x1="265" y1="190" x2="295" y2="190" stroke="black" strokeWidth="0.5" />
      </g>
      <rect x="150" y="240" width="150" height="30" stroke="black" strokeWidth="1" fill="#fff7f5" />
      <circle cx="175" cy="255" r="3" fill="#fd4747" />
      <circle cx="275" cy="255" r="3" fill="#fd4747" />
      <path d="M5 25V5H25" stroke="#fd4747" strokeWidth="2" />
      <path d="M425 5H445V25" stroke="#fd4747" strokeWidth="2" />
      <path d="M445 260V280H425" stroke="#fd4747" strokeWidth="2" />
      <path d="M25 280H5V260" stroke="#fd4747" strokeWidth="2" />
    </svg>
  </div>
);
