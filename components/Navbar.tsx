
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HyperlinkButton, IconButton } from './Buttons';
import { useAuth } from '../context/AuthContext';

/**
 * GLOBAL NAVBAR
 * Persists across pages. Manages navigation and connection status indicator.
 */

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /**
   * NAVIGATION HANDLER
   * Routing is now direct. Disconnected states are handled within the target pages 
   * to ensure the UI remains responsive and provides clear next steps.
   */
  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 py-4 px-12 lg:px-48 flex justify-between items-center ${scrolled ? 'bg-surface/90 backdrop-blur-md py-3 shadow-sm' : 'bg-surface/40 backdrop-blur-sm'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="font-playfair text-2xl font-bold tracking-tighter text-accent">Rewind.</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <HyperlinkButton 
            label="Stats" 
            active={location.pathname === '/stats'} 
            onClick={() => handleNav('/stats')}
          />
          <HyperlinkButton 
            label="Report" 
            active={location.pathname === '/report'} 
            onClick={() => handleNav('/report')}
          />
          <HyperlinkButton 
            label="About" 
            active={location.pathname === '/about'} 
            onClick={() => handleNav('/about')}
          />
          
          {isConnected && (
            <div className="flex items-center gap-2 pl-4 border-l border-black/10">
              <div className="w-2 h-2 rounded-full bg-spotify animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-spotify">Live Session</span>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <IconButton 
            icon={isMenuOpen ? "close" : "menu"} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="border-none !p-0"
          />
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed inset-0 z-[105] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-[320px] bg-surface glass shadow-2xl transition-transform duration-500 p-12 pt-24 flex flex-col justify-between ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="space-y-12">
            <div className="flex flex-col gap-8">
              {['Stats', 'Report', 'About'].map((label) => {
                const path = `/${label.toLowerCase()}`;
                return (
                  <button 
                    key={path}
                    onClick={() => handleNav(path)}
                    className={`text-2xl font-playfair tracking-tighter text-left w-full ${location.pathname === path ? 'text-accent' : 'text-black'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pb-12 text-[8px] text-gray-300 uppercase tracking-widest text-center">REWIND © 2024</div>
        </div>
      </div>
    </>
  );
};
