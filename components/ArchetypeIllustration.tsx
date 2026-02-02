
import React from 'react';

interface ArchetypeIllustrationProps {
  id: string;
  className?: string;
}

export const ArchetypeIllustration: React.FC<ArchetypeIllustrationProps> = ({ id, className = "" }) => {
  switch (id) {
    case '01': // Time Traveler
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M100 20V100L140 140" stroke="#fd4747" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="10" fill="#fd4747" />
          {[...Array(12)].map((_, i) => (
            <rect key={i} x="98" y="25" width="4" height="10" fill="currentColor" opacity="0.2" transform={`rotate(${i * 30} 100 100)`} />
          ))}
        </svg>
      );
    case '02': // Trendsetter
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Ring */}
          <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          {/* Compass/Diamond Frame */}
          <path d="M100 10L190 100L100 190L10 100L100 10Z" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
          {/* Expanding Signal Arcs */}
          <path d="M100 60C122.091 60 140 77.9086 140 100C140 122.091 122.091 140 100 140" stroke="#fd4747" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
          <path d="M100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160" stroke="#fd4747" strokeWidth="2" strokeDasharray="8 6" opacity="0.2" />
          {/* Central Pointing Needle */}
          <path d="M100 100L170 30" stroke="#fd4747" strokeWidth="4" strokeLinecap="round" />
          <path d="M170 30V60M170 30H140" stroke="#fd4747" strokeWidth="4" strokeLinecap="round" />
          {/* Core */}
          <circle cx="100" cy="100" r="12" fill="#fd4747" />
          <circle cx="100" cy="100" r="22" stroke="#fd4747" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case '03': // Deep Diver
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {[...Array(6)].map((_, i) => (
            <path key={i} d={`M40 ${60 + i * 20}C60 ${40 + i * 20} 140 ${80 + i * 20} 160 ${60 + i * 20}`} stroke="currentColor" strokeWidth="1" opacity={0.1 + i * 0.1} />
          ))}
          <path d="M100 30V170M100 170L80 150M100 170L120 150" stroke="#fd4747" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case '04': // Mood Architect
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="40" width="120" height="120" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <path d="M60 160V60H140V160" stroke="#fd4747" strokeWidth="3" />
          <path d="M40 160H160" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="110" r="25" stroke="#fd4747" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M100 85V135" stroke="#fd4747" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case '05': // Soul Seeker
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <path d="M100 160C80 160 40 130 40 90C40 60 70 40 100 70C130 40 160 60 160 90C160 130 120 160 100 160Z" stroke="#fd4747" strokeWidth="3" />
          <circle cx="100" cy="100" r="30" stroke="#fd4747" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="100" cy="100" r="10" fill="#fd4747" opacity="0.3" />
        </svg>
      );
    case '06': // Rhythm Rebel
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 100H60L80 40L120 160L140 100H160" stroke="#fd4747" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <path d="M20 100H180" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
        </svg>
      );
    case '07': // Genre Bender
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="70" r="50" stroke="#fd4747" strokeWidth="2" />
          <circle cx="130" cy="130" r="50" stroke="#fd4747" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="10" fill="#fd4747" />
          <rect x="20" y="20" width="160" height="160" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </svg>
      );
    case '08': // Lyric Legend
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Minimal Elegant Pen */}
          <path d="M150 50L90 140" stroke="#fd4747" strokeWidth="6" strokeLinecap="round" />
          {/* Simplified Nib */}
          <path d="M90 140L78 158L100 148L90 140" fill="#fd4747" />
          {/* Handwritten-style Lyric Line */}
          <path d="M40 160C60 140 80 170 110 160C130 155 145 170 160 165" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          {/* Stylized Ink Point */}
          <circle cx="78" cy="158" r="2.5" fill="#fd4747" />
          {/* Aesthetic Frame */}
          <rect x="35" y="35" width="130" height="130" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </svg>
      );
    default:
      return null;
  }
};
