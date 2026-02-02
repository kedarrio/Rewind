
import React, { useState, useEffect } from 'react';
import { PrimaryButton } from './Buttons';

interface InterstitialAdProps {
  onDismiss: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onDismiss }) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanSkip(true);
    }
  }, [countdown]);

  const handleDismiss = () => {
    sessionStorage.setItem('report_ad_seen', 'true');
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 noise opacity-10"></div>
      
      <div className="relative w-full max-w-3xl bg-surface border-4 border-black p-0 text-center shadow-2xl overflow-hidden glass rounded-none">
        <div className="absolute inset-0 dotted-bg opacity-5"></div>
        
        {/* Mock Video Player Interface */}
        <div className="relative aspect-video bg-black flex items-center justify-center group">
           {/* Ad Badge */}
           <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2 py-1 text-[8px] font-bold text-white uppercase tracking-widest z-20">
              ADVERTISEMENT
           </div>

           {/* Video Visualizer Mock */}
           <div className="w-full h-full flex items-center justify-center gap-1 px-12 opacity-40">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-accent/80 transition-all duration-300" 
                  style={{ 
                    height: `${20 + Math.random() * 60}%`, 
                    animation: `pulse ${1 + Math.random()}s infinite alternate` 
                  }}
                ></div>
              ))}
           </div>

           {/* Play/Pause Button Overlay */}
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="absolute inset-0 w-full h-full flex items-center justify-center z-10 group"
           >
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                 <span className="material-symbols-sharp text-white text-5xl">
                    {isPlaying ? 'pause' : 'play_arrow'}
                 </span>
              </div>
           </button>

           {/* Player Controls Bar */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20 flex flex-col gap-2">
              <div className="h-1 w-full bg-white/20 relative overflow-hidden">
                 <div 
                    className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-linear" 
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                 ></div>
              </div>
              <div className="flex justify-between items-center text-white/60">
                 <div className="flex gap-4">
                    <span className="material-symbols-sharp text-sm">volume_up</span>
                    <span className="text-[10px] font-mono">0:0{5-countdown} / 0:05</span>
                 </div>
                 <span className="text-[9px] font-bold uppercase tracking-widest">Rewind: Premium Experience</span>
              </div>
           </div>
        </div>

        <div className="p-8 md:p-12 relative z-10 bg-surface">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Analysis in Progress</span>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl mb-8">Synchronizing your sonic profile...</h2>

          <div className="flex flex-col items-center gap-6">
            {countdown > 0 ? (
              <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">
                AI INSIGHTS GENERATING IN {countdown}...
              </p>
            ) : (
              <PrimaryButton 
                label="View Full Report" 
                icon="auto_awesome" 
                onClick={handleDismiss} 
                className="px-20 py-5"
              />
            )}
            
            {canSkip && (
              <button 
                onClick={handleDismiss}
                className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-accent transition-all border-b border-transparent hover:border-accent"
              >
                Skip to Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close Button Top Right */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12">
        <button 
          onClick={countdown === 0 ? handleDismiss : undefined}
          className={`p-4 border border-white/20 text-white transition-all ${countdown === 0 ? 'opacity-100 hover:bg-white/10 hover:border-white/40' : 'opacity-20 cursor-not-allowed'}`}
        >
          <span className="material-symbols-sharp">close</span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(0.8); }
          100% { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
};
