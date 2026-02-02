
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/Buttons';
import { spotifyAuth } from '../services/spotifyService';

const BOOT_LOGS = [
  { text: "Starting Rewind...", delay: 100 },
  { text: "Finding your account...", delay: 300 },
  { text: "Checking for music updates...", delay: 600 },
];

export const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { syncTelemetry, isConnected, appStatus, errorMessage, addDevLog } = useAuth();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Check for Spotify Auth Errors in the Hash immediately
    const authResult = spotifyAuth.getTokenFromUrl();
    if (authResult && 'error' in authResult) {
      const spotifyError = authResult.error;
      addDevLog(`Spotify Auth Error: ${spotifyError}`, 'spotify');
      
      let humanMsg = "Authorization failed.";
      if (spotifyError === 'unsupported_response_type') {
        humanMsg = "Spotify 'Implicit Grant' flow is disabled in your dashboard settings.";
      } else if (spotifyError === 'access_denied') {
        humanMsg = "Access denied. Please approve permissions to continue.";
      }
      
      setLocalError(humanMsg);
      setVisibleLogs(prev => [...prev, "Critical: Spotify rejected the handshake.", `Error: ${spotifyError}`]);
      setProgress(0);
      return;
    }

    // Initial Logs Animation
    BOOT_LOGS.forEach((log) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log.text]);
      }, log.delay);
    });

    const startBoot = async () => {
      try {
        await syncTelemetry();
        setVisibleLogs(prev => [...prev, "Account found.", "Music data synced.", "Ready."]);
        setProgress(100);
        setTimeout(() => navigate('/stats'), 800);
      } catch (err: any) {
        // syncTelemetry failure handles its own error state in context
        setVisibleLogs(prev => [...prev, "Sync interrupted.", `Context: ${err.message}`]);
      }
    };

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 2));
    }, 50);

    startBoot();

    return () => clearInterval(interval);
  }, [syncTelemetry, navigate, addDevLog]);

  const finalError = localError || errorMessage;
  const isErrorState = localError || appStatus === 'ERROR' || appStatus === 'TRAFFIC_ERROR';

  return (
    <div className="fixed inset-0 z-[150] bg-surface flex flex-col items-center justify-center p-6 md:p-[10%]">
      <div className="w-full max-w-2xl flex flex-col h-[400px]">
        <div className={`bg-black text-white px-4 py-2 flex justify-between items-center border border-black`}>
          <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${isErrorState ? 'bg-error' : 'bg-accent'}`}></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Setting up your profile</span>
        </div>

        <div className="bg-black flex-1 p-6 border-x border-b border-black shadow-2xl overflow-y-auto">
          <div className="font-mono text-[10px] text-white/80 space-y-2">
            {visibleLogs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-accent/40"></span>
                <span className={log.includes('Account found') || log.includes('Ready') ? 'text-accent' : log.includes('reject') || log.includes('interrupted') ? 'text-error' : ''}>{log}</span>
              </div>
            ))}
            {!isErrorState && progress < 100 && <div className="w-2 h-4 bg-accent animate-pulse"></div>}
          </div>
          
          {isErrorState && (
            <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in duration-500">
              <p className="text-error text-xs font-bold mb-4 uppercase">System Halted</p>
              <p className="text-white/60 text-[10px] mb-6 leading-relaxed max-w-md">
                {finalError || "Internal handshake error."}
              </p>
              <div className="flex gap-4">
                <PrimaryButton label="Go Home" onClick={() => navigate('/')} className="bg-white text-black border-white !px-6" />
                {localError?.includes('dashboard') && (
                  <a 
                    href="https://developer.spotify.com/dashboard" 
                    target="_blank" 
                    className="text-[10px] font-bold text-accent uppercase flex items-center hover:underline"
                  >
                    Open Dashboard
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-black/40 mb-2">
            <span>{isErrorState ? "Failure" : "Syncing..."}</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-black/5">
             <div className={`h-full transition-all duration-300 ${isErrorState ? 'bg-error' : 'bg-accent'}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
