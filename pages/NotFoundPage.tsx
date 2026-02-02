
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { CassetteTape } from '../components/CassetteTape';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAuth();

  const handleGoToDashboard = () => {
    if (isConnected) {
      navigate('/stats');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 text-center animate-in fade-in duration-700">
      <div className="relative mb-12">
        {/* Large Aesthetic 404 */}
        <h1 className="font-playfair text-[120px] md:text-[180px] leading-none text-accent opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          404
        </h1>
        
        {/* Animated Cassette */}
        <div className="relative z-10 scale-75 md:scale-100 opacity-90 hover:opacity-100 transition-opacity duration-500">
          <CassetteTape />
        </div>
      </div>

      <div className="max-w-2xl relative z-20">
        <h2 className="font-playfair text-4xl md:text-5xl mb-4 tracking-tight">Lost in the Music.</h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">This page doesn't exist, but your perfect playlist might.</p>
        
        <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-12 max-w-md mx-auto">
          Looks like you've wandered off the tracklist. This page skipped a beat, but we can get you back to your music data in no time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryButton 
            label={isConnected ? "Go to Dashboard" : "Connect Spotify"} 
            onClick={handleGoToDashboard}
            icon={isConnected ? "dashboard" : "login"}
            className="w-full sm:w-auto px-12"
          />
          <SecondaryButton 
            label="Back Home" 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-12"
          />
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 flex flex-wrap justify-center gap-8">
          <button 
            onClick={() => navigate('/about')}
            className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-accent transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => navigate('/support')}
            className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-accent transition-colors"
          >
            Support
          </button>
          <button 
            onClick={() => navigate('/privacy')}
            className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-accent transition-colors"
          >
            Privacy
          </button>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-10 opacity-[0.03] pointer-events-none hidden lg:block">
        <div className="w-64 h-64 border border-black rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 right-10 opacity-[0.03] pointer-events-none hidden lg:block">
        <div className="w-96 h-96 border border-accent rounded-full"></div>
      </div>
    </div>
  );
};
