
import React, { useState, useEffect } from 'react';
import { IconButton, SuccessButton } from './Buttons';
import { Toast } from './ErrorBanner';

/**
 * STORY GENERATOR OVERLAY
 * ---------------------------------------------------------------------------
 * Allows users to preview and share their musical results in a 9:16 story format.
 */

export interface ShareData {
  user: string;
  date: string;
  website: string;
  archetype: {
    id?: string;
    name?: string;
    oneliner?: string;
    illustration?: React.ReactNode;
  } | null;
  topArtists: {
    '4w': string[];
    '6m': string[];
    '12m': string[];
  };
  topTracks: {
    '4w': string[];
    '6m': string[];
    '12m': string[];
  };
}

interface ShareOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
  initialTab?: 'archetype' | 'artists' | 'tracks';
  initialTimeRange?: '4w' | '6m' | '12m';
}

const SocialLogo = ({ type }: { type: string }) => {
  switch (type) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.035c0 2.123.554 4.197 1.604 6.06L0 24l6.117-1.605a11.793 11.793 0 005.93 1.583h.005c6.635 0 12.032-5.396 12.035-12.035.003-3.217-1.248-6.242-3.513-8.508z"/>
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.05l-2.454-.546-.748 3.41c.204.027.404.063.603.108 1.2-.202 2.303-.102 3.092.247.458.203.762.606.812 1.082.01.099.015.19.015.285 0 1.564-2.257 2.831-5.04 2.831-2.783 0-5.04-1.267-5.04-2.831 0-.095.005-.186.015-.285.05-.476.354-.879.812-1.082.789-.349 1.892-.449 3.092-.247.2-.045.4-.081.604-.108l.842-3.839c.03-.135.14-.235.27-.264l2.73.607a1.25 1.25 0 0 1 .253-.303zM8.151 11.23a1.13 1.13 0 1 1 0 2.261 1.13 1.13 0 0 1 0-2.26zm3.849 5.343c-1.124 0-2.164-.265-2.846-.694a.545.545 0 0 1 .151-.913.547.547 0 0 1 .436.053c.415.263 1.155.453 2.259.453 1.104 0 1.844-.19 2.259-.453a.547.547 0 0 1 .587.86c-.682.429-1.722.694-2.846.694zm3.848-3.082a1.13 1.13 0 1 1 0-2.26 1.13 1.13 0 0 1 0 2.26z"/>
        </svg>
      );
    default:
      return null;
  }
};

const CDDiskIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.6" />
    <circle cx="50" cy="50" r="4.5" fill="currentColor" fillOpacity="0.5" />
    <path d="M75 25C80 30 85 40 85 50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
  </svg>
);

export const ShareOverlay: React.FC<ShareOverlayProps> = ({ 
  isOpen, 
  onClose, 
  data, 
  initialTab = 'archetype',
  initialTimeRange = '4w'
}) => {
  const isArchetypeAvailable = !!data.archetype?.id;
  const [activeTab, setActiveTab] = useState<'archetype' | 'artists' | 'tracks'>(
    isArchetypeAvailable ? initialTab : 'artists'
  );
  const [timeRange, setTimeRange] = useState<'4w' | '6m' | '12m'>(initialTimeRange);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(isArchetypeAvailable ? initialTab : 'artists');
      setTimeRange(initialTimeRange);
    }
  }, [isOpen, initialTab, initialTimeRange, isArchetypeAvailable]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getRangeTitle = () => {
    if (timeRange === '4w') return 'LAST 4 WEEKS';
    if (timeRange === '6m') return 'LAST 6 MONTHS';
    return 'LAST 12 MONTHS';
  };

  const handleDownload = () => {
    setIsGenerating(true);
    // Simulation of image rasterization and download
    setTimeout(() => {
      setIsGenerating(false);
      setToast({ message: "Asset saved to your library.", type: 'success' });
    }, 2500);
  };

  const handleShare = (platform: string) => {
    const text = isArchetypeAvailable 
      ? `I'm a ${data.archetype?.name} on Rewind. Analyze your Spotify DNA here:`
      : `Check out my top Spotify stats on Rewind:`;
    const url = window.location.origin;
    
    let shareUrl = '';
    switch(platform) {
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(text + ' ' + url);
        setToast({ message: "URL copied. Share in your Instagram Story!", type: 'info' });
        return;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center md:items-stretch justify-center">
        
        {/* Story Format Preview */}
        <div className="hidden md:flex relative w-[320px] h-[568px] bg-surface border-4 border-black flex-col overflow-hidden shadow-2xl">
          <div className="absolute inset-0 noise opacity-10"></div>
          <div className="absolute inset-0 dotted-bg opacity-10"></div>
          
          <div className="p-8 pb-4 flex justify-between items-start relative z-10">
            <div>
              <span className="font-playfair text-2xl font-bold italic tracking-tighter text-accent">Rewind.</span>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/30 mt-1">{data.date}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/10">SIDE A</span>
          </div>

          <div className="flex-1 px-8 py-4 relative z-10 flex flex-col items-center justify-center text-center">
            {activeTab === 'archetype' && isArchetypeAvailable ? (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
                <div className="w-44 h-44 mb-10 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-2 border-accent/10 rounded-full scale-125 animate-[spin_60s_linear_infinite]"></div>
                  {data.archetype?.illustration}
                </div>
                <h3 className="font-playfair text-5xl mb-3 tracking-tighter leading-none">{data.archetype?.name}</h3>
                <p className="text-accent text-[9px] font-bold uppercase tracking-[0.4em] mb-8">MY SONIC ARCHETYPE</p>
                <div className="w-16 h-[1.5px] bg-black/10 mb-8"></div>
                <p className="text-gray-500 text-[12px] leading-relaxed max-w-[220px] font-medium italic">
                  "{data.archetype?.oneliner}"
                </p>
              </div>
            ) : (
              <div className="w-full text-left animate-in slide-in-from-bottom-8 duration-500">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8 leading-relaxed">
                  MY TOP {activeTab.toUpperCase()} ON SPOTIFY <br />
                  <span className="text-black/30">// {getRangeTitle()}</span>
                </h4>
                <div className="space-y-4">
                  {(activeTab === 'artists' ? data.topArtists[timeRange] : data.topTracks[timeRange]).slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-black/5 pb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-accent">{(i+1).toString().padStart(2, '0')}</span>
                        <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[200px]">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 pt-4 border-t border-black/5 flex justify-between items-end relative z-10">
            <div className="text-left">
              <p className="text-[9px] text-accent uppercase tracking-[0.3em] font-bold">{data.website}</p>
            </div>
            <CDDiskIcon className="w-12 h-12 text-black/10" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-md bg-white border-4 border-black p-10 md:p-14 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-playfair text-4xl italic">Share Asset</h2>
            <IconButton icon="close" onClick={onClose} className="border-none hover:text-accent !p-0" />
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex border-2 border-black mb-2 p-1 bg-black/5">
                {(['archetype', 'artists', 'tracks'] as const).map((tab) => (
                  <button
                    key={tab}
                    disabled={tab === 'archetype' && !isArchetypeAvailable}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-black/10 text-black/50'} disabled:opacity-10 disabled:cursor-not-allowed`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className={`transition-all duration-500 overflow-hidden ${activeTab !== 'archetype' ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="flex border-2 border-black/10 p-1 bg-white">
                  {(['4w', '6m', '12m'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === range ? 'bg-accent text-white' : 'hover:bg-black/5 text-black/30'}`}
                    >
                      {range === '4w' ? '4W' : range === '6m' ? '6M' : '12M'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/20 mb-8">SELECT DESTINATION</p>
              <div className="grid grid-cols-5 gap-4">
                <button onClick={() => handleShare('instagram')} className="h-16 border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <SocialLogo type="instagram" />
                </button>
                <button onClick={() => handleShare('whatsapp')} className="h-16 border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <SocialLogo type="whatsapp" />
                </button>
                <button onClick={() => handleShare('x')} className="h-16 border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <SocialLogo type="x" />
                </button>
                <button onClick={() => handleShare('reddit')} className="h-16 border-2 border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <SocialLogo type="reddit" />
                </button>
                <SuccessButton 
                  label="" 
                  icon={isGenerating ? "autorenew" : "download"}
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full h-16 !px-0 !gap-0"
                />
              </div>
              {isGenerating && (
                <p className="text-[9px] font-bold uppercase tracking-widest text-success text-center mt-6 animate-pulse">Rasterizing sonic data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
