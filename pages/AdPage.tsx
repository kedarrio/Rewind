
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { useAuth } from '../context/AuthContext';

export const AdPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, reportData, syncReport, isProcessing, appStatus, errorMessage } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const triggerRef = useRef(false);
  
  const isThrottled = appStatus === 'THROTTLED';
  const isTrafficError = appStatus === 'TRAFFIC_ERROR';

  useEffect(() => {
    // Attempt generation if needed - context handles the 24h check
    if (isConnected && !isProcessing && !triggerRef.current && !isThrottled) {
      triggerRef.current = true;
      syncReport();
    }
  }, [isConnected, isProcessing, syncReport, isThrottled]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(p => p - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsFinished(true);
    }
  }, [countdown]);

  const handleProceed = () => {
    sessionStorage.setItem('report_ad_seen', 'true');
    navigate('/report');
  };

  const handleSupport = () => window.open('https://buymeacoffee.com/kedarr', '_blank');

  return (
    <div className="fixed inset-0 z-[300] bg-white flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl bg-white border-4 border-black p-0 shadow-2xl">
        {/* Ad Video Simulator */}
        <div className="aspect-video bg-black relative flex flex-col items-center justify-center">
           <div className="absolute top-4 left-4 bg-white/20 px-2 py-0.5 text-[8px] font-bold text-white tracking-widest">SPONSORED</div>
           
           <div className="w-full h-full opacity-20 flex items-center justify-center gap-1">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="w-1 bg-accent animate-pulse" style={{ height: `${30 + Math.random() * 50}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
           </div>
           
           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="h-0.5 bg-white/20 w-full mb-2">
                 <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${((5-Math.max(0, countdown))/5)*100}%` }}></div>
              </div>
           </div>
        </div>

        <div className="p-10 text-center">
          {isThrottled ? (
            <div className="animate-in fade-in duration-500">
               <span className="material-symbols-sharp text-accent text-4xl mb-4">favorite</span>
               <h2 className="font-playfair text-3xl mb-4">You're up to speed!</h2>
               <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                 To keep Rewind free, reports are limited to one per day. 
                 Your current report is still fresh and ready to view.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <PrimaryButton label="View My Report" onClick={handleProceed} />
                 <SecondaryButton label="Support the Project" icon="favorite" onClick={handleSupport} />
               </div>
               <p className="mt-8 text-[10px] text-gray-400 italic leading-relaxed">
                 "Thank you for being part of Rewind. Every small contribution helps keep this project alive."
               </p>
            </div>
          ) : isTrafficError || appStatus === 'ERROR' ? (
            <div className="animate-in fade-in duration-500">
               <span className="material-symbols-sharp text-error text-4xl mb-4">warning</span>
               <h2 className="font-playfair text-3xl mb-4">Just a second...</h2>
               <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                 {errorMessage || "We're having some trouble creating your report. Please try again tomorrow."}
               </p>
               <PrimaryButton label="Go to Dashboard" onClick={() => navigate('/stats')} />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
               <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent">Creating Your Report</span>
               </div>
               <h2 className="font-playfair text-2xl mb-8">
                 {isProcessing ? "Analyzing your music..." : "Your report is ready."}
               </h2>
               
               <div className="flex flex-col items-center gap-4">
                 {isReadyForButton() ? (
                   <PrimaryButton label="Reveal My Personality" icon="auto_awesome" onClick={handleProceed} className="px-16" />
                 ) : (
                   <span className="text-[11px] font-bold uppercase tracking-widest text-black/30">
                     Finishing up in {countdown}...
                   </span>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <button onClick={() => navigate('/stats')} className="text-black/20 hover:text-black">
          <span className="material-symbols-sharp">close</span>
        </button>
      </div>
    </div>
  );

  function isReadyForButton() {
    return isFinished && !!reportData && !isProcessing;
  }
};
