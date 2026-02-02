
import React, { useState, useEffect, useMemo } from 'react';
import { PrimaryButton, SpotifyButton, SecondaryButton, SuccessButton } from '../components/Buttons';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShareOverlay, ShareData } from '../components/ShareOverlay';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { ErrorBanner, Toast } from '../components/ErrorBanner';
import { CountdownTimer } from '../components/CountdownTimer';
import { ArchetypeIllustration } from '../components/ArchetypeIllustration';
import { ActionCard } from '../components/ActionCard';
import { Reveal } from '../components/Reveal';

/**
 * AI PERSONALITY REPORT PAGE
 * ---------------------------------------------------------------------------
 * This page visualizes the "Intelligence Pipeline" output.
 * It contains narrative analysis from Gemini and specialized 
 * visualizations like the Radar Chart and Genre Distribution.
 */

const FEATURE_KEYS = [
  { key: 'energy', label: 'ENERGY' },
  { key: 'danceability', label: 'DANCE' },
  { key: 'valence', label: 'MOOD' },
  { key: 'acousticness', label: 'ACOUSTIC' },
  { key: 'instrumentalness', label: 'INSTRUM' },
  { key: 'speechiness', label: 'LYRIC' }
];

/**
 * RADAR CHART COMPONENT
 * Manually draws a polygon based on the 0-1 values of Spotify audio features.
 * Uses trigonometric functions to plot points on a radial coordinate system.
 */
const RadarChart = ({ data }: { data: Record<string, number> }) => {
  const size = 500; 
  const center = size / 2;
  const radius = 160;

  // PLOTTING MATH
  const points = FEATURE_KEYS.map((feat, i) => {
    const angle = (Math.PI * 2 * i) / FEATURE_KEYS.length - Math.PI / 2;
    const value = Math.max(0.1, data[feat.key] || 0); // Avoid collapsing to zero
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="relative group w-full max-w-[400px] lg:max-w-[450px] mx-auto aspect-square flex items-center justify-center p-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-[1.02]">
        {/* Background Grid Lines */}
        {gridLevels.map((level, i) => {
          const gridPoints = FEATURE_KEYS.map((_, j) => {
            const angle = (Math.PI * 2 * j) / FEATURE_KEYS.length - Math.PI / 2;
            const x = center + radius * level * Math.cos(angle);
            const y = center + radius * level * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={i}
              points={gridPoints}
              fill="none"
              stroke="black"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray={i === 3 ? "0" : "4 4"}
            />
          );
        })}
        
        {/* Metric Labels */}
        {FEATURE_KEYS.map((feat, i) => {
          const angle = (Math.PI * 2 * i) / FEATURE_KEYS.length - Math.PI / 2;
          const textX = center + (radius + 80) * Math.cos(angle);
          const textY = center + (radius + 80) * Math.sin(angle);
          return (
            <text key={feat.key} x={textX} y={textY} textAnchor="middle" className="text-[16px] font-bold uppercase tracking-[0.25em] fill-black" dominantBaseline="middle">
              {feat.label}
            </text>
          );
        })}
        
        {/* THE DATA POLYGON */}
        <polygon points={points} fill="#fd4747" fillOpacity="0.15" stroke="#fd4747" strokeWidth="4" strokeLinejoin="round" className="transition-all duration-1000 ease-out" />
      </svg>
    </div>
  );
};

export const ReportPage: React.FC = () => {
  const { isConnected, reportData, spotifyData, errorMessage, lastReportGeneration, syncReport, isProcessing, appStatus } = useAuth();
  const navigate = useNavigate();
  
  const [showShare, setShowShare] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  /**
   * INTERSTITIAL LOGIC
   * We require users to "view an ad" (the InterstitialAd component) before 
   * the final report is revealed. This is tracked via sessionStorage.
   */
  useEffect(() => {
    const hasSeenAd = sessionStorage.getItem('report_ad_seen');
    if (isConnected && !!spotifyData?.stats && (!hasSeenAd || !reportData)) {
      navigate('/ad');
    }
  }, [isConnected, spotifyData, reportData, navigate]);

  // UI DERIVATION: Genre Distribution (Top 5)
  const genreDistribution = useMemo(() => {
    if (!spotifyData?.stats?.['4w']?.artists) return [];
    const counts: Record<string, number> = {};
    spotifyData.stats['4w'].artists.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, entry) => sum + entry[1], 0);
    return entries.slice(0, 5).map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100)
    }));
  }, [spotifyData]);

  if (!isConnected || !reportData) return null;

  const handleRegenerate = async () => {
    await syncReport(true);
    setToast({ message: "Intelligence updated.", type: 'success' });
  };

  const containerClasses = "max-w-7xl mx-auto px-6 lg:px-48 w-full";
  
  // Rate Limit check for regenerate button
  const nextAvailableAt = lastReportGeneration 
    ? new Date(new Date(lastReportGeneration).getTime() + 24 * 60 * 60 * 1000).toISOString()
    : null;
  const isAvailable = nextAvailableAt ? new Date().getTime() >= new Date(nextAvailableAt).getTime() : true;

  return (
    <div className="animate-in fade-in duration-1000 pb-32 flex flex-col items-center overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      
      {/* 1. HERO: THE ARCHETYPE */}
      <section className={`pt-24 lg:pt-32 pb-16 lg:pb-24 ${containerClasses}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <Reveal direction="left" className="flex-1 text-center lg:text-left">
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-9xl mb-8 tracking-tighter leading-[0.85]">
              {reportData.archetype.name}<span className="text-accent">.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mb-10 font-medium">
              {reportData.archetype.description}
            </p>
            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <span className="px-6 py-2 border-2 border-accent text-accent text-[10px] font-bold uppercase tracking-widest bg-accent/[0.04]">
                {reportData.archetype.trait}
              </span>
              <PrimaryButton label="Share Report" icon="ios_share" onClick={() => setShowShare(true)} />
            </div>
          </Reveal>
          
          <Reveal direction="right" className="w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] relative flex items-center justify-center flex-shrink-0">
            {/* Aesthetic spinning rings */}
            <div className="absolute inset-0 border border-black/[0.03] rounded-full scale-110 lg:scale-125 animate-[spin_100s_linear_infinite]"></div>
            <ArchetypeIllustration id={reportData.archetype.id} className="w-full h-full text-accent relative z-10 p-8 lg:p-16" />
          </Reveal>
        </div>
      </section>

      <AdPlaceholder size="leaderboard" slot="report-hero-bottom" />

      {/* 2. SONIC DNA (AI NARRATIVE) */}
      <section className={`${containerClasses} mb-32 lg:mb-48`}>
        <SectionHeader title="Your Sonic Profile" subtitle="Identity" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal className="space-y-8">
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-playfair italic">
              {reportData.aiGeneratedText.musicalDNA}
            </p>
          </Reveal>
          <Reveal className="bg-surface border-2 border-black/5 border-l-8 border-l-accent p-8 lg:p-10 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent block mb-6 uppercase">The "Why"</span>
            <p className="text-base leading-relaxed text-gray-700">
              {reportData.aiGeneratedText.whyArchetype}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. SOUND METRICS (RADAR) */}
      <section className={`${containerClasses} mb-32 lg:mb-48`}>
        <SectionHeader title="Sound Metrics" subtitle="Acoustics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal className="order-2 lg:order-1 p-6 md:p-16 bg-white border-2 border-black/5 relative overflow-hidden shadow-2xl flex items-center justify-center">
            <RadarChart data={reportData.audioFeatures} />
          </Reveal>
          <Reveal className="order-1 lg:order-2 space-y-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent block mb-4">Sonic Signature</span>
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-black italic">
                "{reportData.aiGeneratedText.sonicSignature}"
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. GENRES PORTRAIT */}
      <section className={`${containerClasses} mb-32 lg:mb-48`}>
        <SectionHeader title="Genre Portrait" subtitle="Discovery" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="space-y-10">
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-playfair italic">
              {reportData.aiGeneratedText.genreAnalysis}
            </p>
          </Reveal>
          
          <Reveal className="bg-surface border border-black/10 relative p-8 lg:p-12 overflow-hidden flex flex-col justify-end shadow-sm">
             {/* Dynamic Progress Bars for Genres */}
             <div className="relative z-10 space-y-6">
               {genreDistribution.map((genre) => (
                 <div key={genre.name} className="space-y-2">
                   <div className="flex justify-between items-end">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">{genre.name}</span>
                     <span className="text-[10px] font-bold text-accent">{genre.percentage}%</span>
                   </div>
                   <div className="w-full h-2 bg-black/10">
                     <div className="h-full bg-accent transition-all duration-1000 delay-500" style={{ width: `${genre.percentage}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </Reveal>
        </div>
      </section>

      {/* 5. FOOTER: REGENERATE & NAVIGATION */}
      <section className={`${containerClasses} pb-24 border-t border-black/5 pt-20`}>
        <Reveal direction="up" className="max-w-4xl">
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-playfair italic mb-12">
            {reportData.aiGeneratedText.emotionalLandscape}
          </p>
          <div className="flex flex-wrap gap-4">
             <SecondaryButton label="Return to Stats" onClick={() => navigate('/stats')} />
             {isAvailable ? (
               <SuccessButton label="Refresh Analysis" icon="refresh" onClick={handleRegenerate} disabled={isProcessing} />
             ) : (
               <div className="flex items-center gap-3 px-6 py-2 border border-black/10">
                  <span className="text-[10px] font-bold text-black/20">NEXT UPDATE:</span>
                  <CountdownTimer targetTime={nextAvailableAt!} />
               </div>
             )}
          </div>
        </Reveal>
      </section>

      {showShare && (
        <ShareOverlay 
          isOpen={showShare} 
          onClose={() => setShowShare(false)} 
          data={{} as any} // Share logic implementation...
        />
      )}
    </div>
  );
};
