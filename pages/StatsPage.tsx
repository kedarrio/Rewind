
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton, SpotifyButton, DangerButton } from '../components/Buttons';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { ActionCard } from '../components/ActionCard';
import { ShareOverlay, ShareData } from '../components/ShareOverlay';
import { ErrorBanner, Toast } from '../components/ErrorBanner';
import { FreshnessIndicator } from '../components/FreshnessIndicator';
import { Reveal } from '../components/Reveal';
import { ArchetypeIllustration } from '../components/ArchetypeIllustration';
import { AdPlaceholder } from '../components/AdPlaceholder';

/**
 * STATS DASHBOARD PAGE
 * ---------------------------------------------------------------------------
 * This page visualizes the "Stats Pipeline" (Spotify Telemetry).
 * It uses a tabbed layout to switch between short, medium, and long-term data.
 */

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isConnected, 
    disconnect, 
    lastStatsRefresh, 
    syncTelemetry,
    reportData,
    spotifyData,
    appStatus,
    errorMessage
  } = useAuth();
  
  // UI State: Time Range (4 Weeks, 6 Months, 1 Year)
  const [timeRange, setTimeRange] = useState<'4w' | '6m' | '12m'>('4w');
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [shareModal, setShareModal] = useState<{ open: boolean, type: 'artists' | 'tracks' | 'archetype' }>({ open: false, type: 'artists' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const stats = spotifyData?.stats;
  const userData = spotifyData?.user || { displayName: "Listener" };

  // DATA FILTERING: Memoized slices to prevent re-calculating on every render
  const activeArtists = useMemo(() => {
    if (!stats?.[timeRange]) return [];
    return stats[timeRange].artists.slice(0, showAllArtists ? 50 : 10);
  }, [timeRange, showAllArtists, stats]);

  const activeTracks = useMemo(() => {
    if (!stats?.[timeRange]) return [];
    return stats[timeRange].tracks.slice(0, showAllTracks ? 50 : 10);
  }, [timeRange, showAllTracks, stats]);

  const top3Artists = activeArtists.slice(0, 3);
  const top3Tracks = activeTracks.slice(0, 3);

  const onLogout = () => {
    disconnect();
    navigate('/');
  };

  const handleRefresh = async () => {
    try {
      await syncTelemetry(true);
      setToast({ message: "Music data updated.", type: 'success' });
    } catch (e) {
      // Error handling is centralized in AuthContext & ErrorBanner
    }
  };

  // SHARE DATA FORMATTING: Prepared for the story-generator modal
  const shareData: ShareData | null = useMemo(() => {
    if (!stats) return null;
    return {
      user: userData.username || userData.displayName,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
      website: "REWIND.APP",
      archetype: reportData ? {
        id: reportData.archetype.id,
        name: reportData.archetype.name,
        oneliner: reportData.archetype.oneliner,
        illustration: <ArchetypeIllustration id={reportData.archetype.id} />
      } : null,
      topArtists: {
        '4w': stats['4w'].artists.map((a: any) => a.name),
        '6m': stats['6m'].artists.map((a: any) => a.name),
        '12m': stats['12m'].artists.map((a: any) => a.name),
      },
      topTracks: {
        '4w': stats['4w'].tracks.map((t: any) => t.title),
        '6m': stats['6m'].tracks.map((t: any) => t.title),
        '12m': stats['12m'].tracks.map((t: any) => t.title),
      }
    };
  }, [stats, userData, reportData]);

  // PROTECTION: Redirect or show empty state if not connected
  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 lg:px-48 text-center animate-in fade-in duration-700">
        <span className="material-symbols-sharp text-6xl text-black/10 mb-6">lock_open</span>
        <h1 className="font-playfair text-4xl md:text-5xl mb-4 text-stone-900">Your account is <span className="text-accent italic">not connected.</span></h1>
        <p className="text-gray-500 mb-10 max-w-md">Please sign in with Spotify so we can show you your listening habits.</p>
        <div className="flex flex-col items-center">
            <SpotifyButton label="Sign in with Spotify" onClick={() => navigate('/loading')} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 pb-24 overflow-x-hidden">
      {/* Global Status Notifications */}
      {(appStatus === 'TRAFFIC_ERROR' || appStatus === 'ERROR') && (
        <ErrorBanner 
          message={errorMessage || "We're having trouble reaching Spotify."} 
          type={appStatus === 'TRAFFIC_ERROR' ? "warning" : "error"}
          onRefresh={handleRefresh}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onDismiss={() => setToast(null)} 
        />
      )}

      {/* Sharing Overlay */}
      {shareData && (
        <ShareOverlay 
          isOpen={shareModal.open} 
          onClose={() => setShareModal(prev => ({ ...prev, open: false }))} 
          data={shareData}
          initialTab={shareModal.type}
          initialTimeRange={timeRange}
        />
      )}

      {/* USER PROFILE HEADER */}
      <Reveal direction="down" className="px-6 lg:px-48 pt-24 lg:pt-32 pb-4 relative max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-8">
          <div>
            <span className="text-accent uppercase tracking-[0.3em] font-bold text-[10px]">Your Profile</span>
            <div className="mt-4">
              <span className="font-space text-lg text-black block">Hello,</span>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mt-0 tracking-tight break-words">{userData.displayName}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <DangerButton label="Sign Out" onClick={onLogout} icon="logout" className="!px-4" />
          </div>
        </div>
      </Reveal>

      {!stats ? (
        <section className="px-6 lg:px-48 py-20 max-w-[1920px] mx-auto text-center">
          <ActionCard centered title="No Data Found">
            <PrimaryButton label="Try Again" onClick={handleRefresh} />
          </ActionCard>
        </section>
      ) : (
        <>
          {/* AI REPORT CTA */}
          <Reveal className="px-6 lg:px-48 py-8 max-w-[1920px] mx-auto">
            <ActionCard
              label="AI Report"
              title={reportData ? "Your report is ready." : "Get your personality report."}
              description={reportData ? "View your detailed analysis." : "Let our AI analyze your unique listening style."}
            >
              <PrimaryButton 
                label={reportData ? "View My Report" : "Get AI Report"} 
                icon="auto_awesome" 
                onClick={() => navigate('/ad')} 
                className="min-w-[180px] md:min-w-[200px]" 
              />
            </ActionCard>
          </Reveal>

          <AdPlaceholder size="leaderboard" slot="stats-top-banner" />

          {/* TIME RANGE SELECTOR (STUCK ON SCROLL) */}
          <Reveal direction="none" className="px-6 lg:px-48 py-8 sticky top-16 z-[105] bg-transparent max-w-[1920px] mx-auto">
            <div className="flex flex-col items-center">
               <div className="glass flex bg-surface/80 backdrop-blur-xl p-1 border border-black/10 gap-1 relative shadow-[0_20px_50px_rgba(0,0,0,0.05)] scale-90 md:scale-100 animate-in duration-500">
                  {(['4w', '6m', '12m'] as const).map((range) => (
                    <button 
                      key={range}
                      onClick={() => setTimeRange(range)} 
                      className={`px-4 md:px-8 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${timeRange === range ? 'bg-black text-white scale-[1.02] shadow-lg' : 'hover:bg-black/5 text-black/50 hover:text-black'}`}
                    >
                      {range === '4w' ? '4 Weeks' : range === '6m' ? '6 Months' : '1 Year'}
                    </button>
                  ))}
               </div>
            </div>
          </Reveal>

          {/* ARTISTS GRID (PODIUM STYLE) */}
          <section className="px-6 lg:px-48 py-12 lg:py-16 max-w-[1920px] mx-auto">
            <Reveal direction="left" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
              <SectionHeader title="Top Artists" subtitle={getRangeLabel(timeRange)} />
              <SecondaryButton label="Share Image" icon="share" className="mb-0 md:mb-12" onClick={() => setShareModal({ open: true, type: 'artists' })} />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20 items-end">
              {/* Podium Visuals (Top 3) */}
              {top3Artists.map((artist: any, i: number) => (
                <div key={`${timeRange}-art-${i}`} className={`flex flex-col items-center group cursor-pointer w-full ${i === 0 ? 'order-1 md:order-2' : i === 1 ? 'order-2 md:order-1' : 'order-3'}`}>
                  <div className={`relative mb-0 w-full aspect-square border-black overflow-hidden transform transition-all duration-500 hover:-translate-y-3 ${i === 0 ? 'border-2 border-accent shadow-[15px_15px_0px_0px_rgba(253,71,71,0.08)]' : 'border'}`}>
                    <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1.5 ${i === 0 ? 'bg-accent text-white' : 'bg-black text-white'}`}>#0{i+1}</div>
                  </div>
                  <div className={`w-full p-6 text-center shadow-lg transition-colors ${i === 0 ? 'bg-black text-white hover:bg-accent' : 'bg-surface border-x border-b border-black/10 hover:bg-[#f2e6e2]'}`}>
                    <h3 className="font-playfair text-xl font-bold truncate">{artist.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* LOWER RANKS TABLE */}
            <Reveal direction="up" className="border border-black/10 overflow-hidden bg-surface shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/5 border-b border-black/10">
                    <tr>
                      <th className="py-4 px-8 text-[9px] uppercase tracking-widest font-bold text-gray-400">Rank</th>
                      <th className="py-4 px-8 text-[9px] uppercase tracking-widest font-bold text-gray-400">Artist</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {activeArtists.slice(3).map((artist: any, idx: number) => (
                      <tr key={`${timeRange}-art-row-${idx}`} className="group hover:bg-black/[0.01] transition-colors">
                        <td className="py-4 px-8 font-bold text-gray-300 group-hover:text-accent">{(idx + 4).toString().padStart(2, '0')}</td>
                        <td className="py-4 px-8">
                          <span className="font-bold text-xs uppercase group-hover:text-accent transition-colors truncate block">{artist.name}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 flex justify-center border-t border-black/5">
                <SecondaryButton label={showAllArtists ? "Show Fewer" : "Show All 50"} onClick={() => setShowAllArtists(!showAllArtists)} icon={showAllArtists ? "expand_less" : "expand_more"} />
              </div>
            </Reveal>
          </section>

          <AdPlaceholder size="leaderboard" slot="stats-mid-artists-tracks" />

          {/* TRACKS LIST (REPLICATES ARTISTS STRUCTURE) */}
          <section className="px-6 lg:px-48 py-12 lg:py-16 max-w-[1920px] mx-auto border-t border-black/5">
            <Reveal direction="left" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
              <SectionHeader title="Top Songs" subtitle={getRangeLabel(timeRange)} />
              <SecondaryButton label="Share Image" icon="share" className="mb-0 md:mb-12" onClick={() => setShareModal({ open: true, type: 'tracks' })} />
            </Reveal>

            {/* Top 3 tracks grid (similar to artists) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
              {top3Tracks.map((track: any, i: number) => (
                <div key={`${timeRange}-trk-${i}`} className={`flex flex-col items-center group cursor-pointer w-full ${i === 0 ? 'order-1 md:order-2' : i === 1 ? 'order-2 md:order-1' : 'order-3'}`}>
                  <div className={`relative w-full aspect-square border-black overflow-hidden transition-all duration-500 hover:-translate-y-3 ${i === 0 ? 'border-2 border-accent shadow-[15px_15px_0px_0px_rgba(253,71,71,0.08)]' : 'border'}`}>
                    <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1.5 ${i === 0 ? 'bg-accent text-white' : 'bg-black text-white'}`}>#0{i+1}</div>
                  </div>
                  <div className={`w-full p-6 text-center shadow-lg transition-colors ${i === 0 ? 'bg-black text-white hover:bg-accent' : 'bg-surface border-x border-b border-black/10 hover:bg-[#f2e6e2]'}`}>
                    <h3 className="font-playfair text-xl font-bold truncate">{track.title}</h3>
                    <p className="text-[10px] font-bold opacity-50 uppercase mt-1 truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lower rank tracks table */}
            <Reveal direction="up" className="border border-black/10 overflow-hidden bg-surface shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/5 border-b border-black/10">
                    <tr>
                      <th className="py-4 px-8 text-[9px] uppercase tracking-widest font-bold text-gray-400">Rank</th>
                      <th className="py-4 px-8 text-[9px] uppercase tracking-widest font-bold text-gray-400">Song</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {activeTracks.slice(3).map((track: any, idx: number) => (
                      <tr key={`${timeRange}-trk-row-${idx}`} className="group hover:bg-black/[0.01] transition-colors">
                        <td className="py-4 px-8 font-bold text-gray-300 group-hover:text-accent">{(idx + 4).toString().padStart(2, '0')}</td>
                        <td className="py-4 px-8">
                          <div className="flex flex-col truncate">
                            <span className="font-bold text-xs uppercase group-hover:text-accent transition-colors">{track.title}</span>
                            <span className="text-[9px] text-black/40 font-bold uppercase">{track.artist}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 flex justify-center border-t border-black/5">
                <SecondaryButton label={showAllTracks ? "Show Fewer" : "Show All 50"} onClick={() => setShowAllTracks(!showAllTracks)} icon={showAllTracks ? "expand_less" : "expand_more"} />
              </div>
            </Reveal>
          </section>

          <AdPlaceholder size="leaderboard" slot="stats-footer-banner" />

          {/* FRESHNESS & SYNC INDICATOR */}
          <Reveal direction="up" className="px-6 lg:px-48 py-8 max-w-[1920px] mx-auto">
            <FreshnessIndicator 
              label="Last Updated" 
              lastUpdated={lastStatsRefresh} 
              onRefresh={handleRefresh}
              type="stats"
            />
          </Reveal>
        </>
      )}
    </div>
  );

  function getRangeLabel(range: string) {
    if (range === '4w') return '4 Weeks';
    if (range === '6m') return '6 Months';
    return '1 Year';
  }
};
