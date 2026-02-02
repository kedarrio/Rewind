
import React from 'react';

interface AdPlaceholderProps {
  size: 'leaderboard' | 'rectangle' | 'mobile-banner';
  slot: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, slot, className = '' }) => {
  const getDimensions = () => {
    switch (size) {
      case 'leaderboard':
        /**
         * Responsive Leaderboard:
         * Mobile: 320x100 (Large Mobile Banner)
         * Tablet: 468x60 (Banner)
         * Desktop: 728x90 (Leaderboard)
         */
        return 'w-full max-w-[320px] sm:max-w-[468px] lg:max-w-[728px] h-[100px] sm:h-[60px] lg:h-[90px]';
      case 'rectangle':
        /**
         * Medium Rectangle: 300x250
         * Fits most viewports, we ensure it doesn't overflow on very small screens.
         */
        return 'w-full max-w-[300px] h-[250px]';
      case 'mobile-banner':
        /**
         * Mobile Banner: 320x50
         */
        return 'w-full max-w-[320px] h-[50px]';
      default:
        return 'w-full h-[90px]';
    }
  };

  const getLabel = () => {
    switch (size) {
      case 'leaderboard':
        return (
          <>
            <span className="hidden lg:inline">Leaderboard (728x90)</span>
            <span className="hidden sm:inline lg:hidden">Banner (468x60)</span>
            <span className="inline sm:hidden">Large Mobile Banner (320x100)</span>
          </>
        );
      case 'rectangle':
        return 'Medium Rectangle (300x250)';
      case 'mobile-banner':
        return 'Mobile Banner (320x50)';
      default:
        return 'Advertisement';
    }
  };

  return (
    <div 
      className={`ad-placeholder mx-auto my-12 flex flex-col items-center justify-center relative bg-[#f5f5f5] border border-dashed border-[#ddd] backdrop-blur-sm overflow-hidden transition-all duration-300 ${getDimensions()} ${className}`}
      aria-label={`Advertisement: ${slot}`}
    >
      <div className="absolute inset-0 noise opacity-[0.02]"></div>
      <div className="absolute inset-0 dotted-bg opacity-[0.05]"></div>
      
      {/* Blueprint-style markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ccc]"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ccc]"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ccc]"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ccc]"></div>

      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#999] relative z-10">
        Advertisement
      </span>
      <span className="text-[8px] uppercase tracking-widest text-[#bbb] mt-1 relative z-10 text-center px-4">
        {getLabel()} . ID: {slot}
      </span>
    </div>
  );
};
