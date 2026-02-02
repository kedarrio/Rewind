
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HyperlinkButton } from './Buttons';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-surface/60 py-16 px-12 lg:px-48 border-t border-black/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div>
            <span className="font-playfair text-2xl font-bold tracking-tighter text-accent cursor-pointer" onClick={() => navigate('/')}>Rewind.</span>
            <p className="mt-4 text-[13px] text-gray-500 max-w-xs leading-relaxed">
              Your musical journey, analyzed and visualized with precision and soul.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest text-[10px] mb-2 text-black/40">Navigation</h4>
            <HyperlinkButton label="About" onClick={() => navigate('/about')} />
            <HyperlinkButton label="Support" onClick={() => navigate('/support')} />
            <HyperlinkButton label="Privacy Policy" onClick={() => navigate('/privacy')} />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest text-[10px] mb-2 text-black/40">Support</h4>
            <HyperlinkButton label="Buy Me a Coffee" onClick={() => window.open('https://buymeacoffee.com/kedarr', '_blank')} />
            <HyperlinkButton label="OnlyChai" onClick={() => window.open('https://onlychai.neocities.org/support.html?name=Kedar&upi=kedarmulay@upi#', '_blank')} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-widest font-medium text-gray-400">
        <p>© 2024 Rewind. Made with ❤️ for music lovers.</p>
        <div className="flex gap-8">
          <a href="https://www.instagram.com/kedarr0/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram @kedarr0</a>
        </div>
      </div>
    </footer>
  );
};
