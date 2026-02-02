
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpotifyButton, PrimaryButton } from '../components/Buttons';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { CassetteTape } from '../components/CassetteTape';
import { useAuth } from '../context/AuthContext';
import { ActionCard } from '../components/ActionCard';
import { ARCHETYPES } from '../data/archetypes';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { ArchetypeIllustration } from '../components/ArchetypeIllustration';
import { Reveal } from '../components/Reveal';
import { spotifyAuth } from '../services/spotifyService';

const ArchetypeShuffle: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % ARCHETYPES.length);

  return (
    <div className="relative w-full h-[440px] md:h-[500px] flex items-center justify-start cursor-pointer group" onClick={nextCard}>
      {ARCHETYPES.map((arch, idx) => {
        const position = (idx - currentIndex + ARCHETYPES.length) % ARCHETYPES.length;
        const isMain = position === 0;
        const style: React.CSSProperties = {
          transform: `translateX(${position * 6}px) translateY(${position * 6}px)`,
          zIndex: ARCHETYPES.length - position,
          opacity: position > 4 ? 0 : (1 - position * 0.15),
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        };
        return (
          <div key={arch.id} className={`absolute top-0 left-0 w-full max-w-2xl bg-surface border border-black/10 p-10 md:p-12 flex flex-col justify-between shadow-xl overflow-hidden min-h-[400px] md:min-h-[460px]`} style={style}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[8vw] font-space leading-none opacity-[0.02] select-none pointer-events-none uppercase tracking-tighter ${isMain ? 'text-accent' : 'text-black'}`}>{arch.bgText}</div>
            <div className="flex justify-between items-start relative z-10 mb-8">
              <ArchetypeIllustration id={arch.id} className="w-16 h-16 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300">Type {arch.id}</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-6xl font-playfair font-bold mb-2 uppercase tracking-tight">{arch.name}</h3>
              <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6">{arch.trait}</p>
              <p className="text-sm text-gray-600 max-w-md leading-relaxed">{arch.description}</p>
            </div>
            <div className="flex justify-end relative z-10">
               <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">click to see next</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AuthErrorModal: React.FC<{ isOpen: boolean; onClose: () => void; onRetry: () => void }> = ({ isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface border-2 border-accent p-12 max-w-md w-full relative overflow-hidden glass shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="absolute inset-0 dotted-bg opacity-10 pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-sharp text-accent text-3xl">error</span>
          </div>
          <h3 className="font-playfair text-3xl mb-4">Connection Failed</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            We couldn't connect to your Spotify account. This might be because you denied permission or there was a network issue.
          </p>
          <div className="flex flex-col gap-4">
            <PrimaryButton label="Try Again" onClick={onRetry} />
            <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, useDummy, spotifyToken } = useAuth();
  const [showAuthError, setShowAuthError] = useState(false);

  const handleCTA = () => {
    if (!useDummy) {
      if (spotifyToken) {
        navigate('/loading');
      } else {
        window.location.href = spotifyAuth.getLoginUrl();
      }
      return;
    }
    
    if (isConnected) {
      navigate('/stats');
    } else {
      navigate('/loading');
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <AuthErrorModal 
        isOpen={showAuthError} 
        onClose={() => setShowAuthError(false)} 
        onRetry={() => { setShowAuthError(false); navigate('/loading'); }} 
      />

      <section className="relative px-12 lg:px-48 py-20 md:py-32 overflow-hidden bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <Reveal direction="left" className="max-w-2xl flex-1 text-center lg:text-left">
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl leading-[1] mb-6">Rewind <br /> your <span className="text-accent">music.</span></h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">Discover your unique listening personality and dive deep into your Spotify data with AI-powered insights.</p>
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {isConnected ? (
                <PrimaryButton label="View Your Stats" onClick={() => navigate('/stats')} />
              ) : (
                <SpotifyButton label="Connect to Spotify" onClick={handleCTA} />
              )}
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.2} className="flex-1 flex justify-center lg:justify-end relative scale-90 md:scale-100">
            <CassetteTape className="relative z-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] pointer-events-none opacity-[0.08] -z-10">
              <div className="w-full h-full border-[1px] border-black rounded-full animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-16 border-[1px] border-black rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute inset-32 border-[1px] border-black rounded-full animate-[spin_20s_linear_infinite]"></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="px-12 lg:px-48 py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <SectionHeader title="What You'll Discover" subtitle="Features" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0.1} direction="up" className="h-full">
              <Card className="h-full flex flex-col items-start border-black/[0.03] hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-accent/5 flex items-center justify-center mb-6"><span className="material-symbols-sharp text-accent text-2xl">person_search</span></div>
                <h3 className="text-xl font-bold mb-3">Your Music Personality</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Find out which of 8 unique listener types matches your music taste.</p>
              </Card>
            </Reveal>
            <Reveal delay={0.2} direction="up" className="h-full">
              <Card className="h-full flex flex-col items-start border-black/[0.03] hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-accent/5 flex items-center justify-center mb-6"><span className="material-symbols-sharp text-accent text-2xl">analytics</span></div>
                <h3 className="text-xl font-bold mb-3">Listening Stats</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Explore your top tracks, artists, and listening habits over time.</p>
              </Card>
            </Reveal>
            <Reveal delay={0.3} direction="up" className="h-full">
              <Card className="h-full flex flex-col items-start border-black/[0.03] hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 bg-accent/5 flex items-center justify-center mb-6"><span className="material-symbols-sharp text-accent text-2xl">auto_awesome</span></div>
                <h3 className="text-xl font-bold mb-3">AI Personality Report</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Get personalized analysis of your music preferences and listening style.</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal threshold={0.5} className="px-12 lg:px-48 py-8 bg-transparent">
        <AdPlaceholder size="leaderboard" slot="landing-mid-page" />
      </Reveal>

      <section id="archetypes" className="px-12 lg:px-48 py-24 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal direction="left">
            <SectionHeader title="Your Music Personality" subtitle="The Archetypes" />
          </Reveal>
          <Reveal delay={0.2} direction="up" className="py-8"><ArchetypeShuffle /></Reveal>
        </div>
      </section>

      <section className="px-12 lg:px-48 py-32 bg-transparent relative">
        <Reveal direction="up" className="max-w-7xl mx-auto">
          <ActionCard
            centered
            title={<>Ready to Start Your <br /><span className="text-accent transition-transform duration-500 group-hover:scale-105 inline-block">Music Journey?</span></>}
            footer={
              <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2 justify-center">
                <span className="material-symbols-sharp text-[14px]">lock</span>
                YOUR DATA IS PRIVATE AND SECURE.
              </p>
            }
          >
            {isConnected ? (
              <PrimaryButton label="Go to My Profile" onClick={() => navigate('/stats')} />
            ) : (
              <SpotifyButton label="Sign in with Spotify" onClick={handleCTA} />
            )}
          </ActionCard>
        </Reveal>
      </section>
    </div>
  );
};
