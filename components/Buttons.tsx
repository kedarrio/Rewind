import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
  disabled?: boolean;
}

const baseStyles = "px-7 py-2.5 font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 sharp-corners disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ripple-btn";

export const PrimaryButton: React.FC<ButtonProps> = ({ label, onClick, className = '', icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyles} bg-accent text-white border-2 border-accent hover:bg-black hover:border-black hover:shadow-[0_4px_12px_rgba(253,71,71,0.2)] ${className}`}
    style={{ borderRadius: '0' }}
  >
    {icon && <span className="material-symbols-sharp text-sm">{icon}</span>}
    {label}
  </button>
);

export const SecondaryButton: React.FC<ButtonProps> = ({ label, onClick, className = '', icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyles} bg-transparent text-black border-2 border-black hover:bg-black hover:text-white ${className}`}
    style={{ borderRadius: '0' }}
  >
    {icon && <span className="material-symbols-sharp text-sm">{icon}</span>}
    {label}
  </button>
);

export const SuccessButton: React.FC<ButtonProps> = ({ label, onClick, className = '', icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyles} bg-success text-white border-2 border-success hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] ${className}`}
    style={{ borderRadius: '0' }}
  >
    {icon && <span className="material-symbols-sharp text-sm">{icon}</span>}
    {label}
  </button>
);

export const DangerButton: React.FC<ButtonProps> = ({ label, onClick, className = '', icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyles} bg-error text-white border-2 border-error hover:bg-red-600 hover:border-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] ${className}`}
    style={{ borderRadius: '0' }}
  >
    {icon && <span className="material-symbols-sharp text-sm">{icon}</span>}
    {label}
  </button>
);

export const SpotifyButton: React.FC<ButtonProps> = ({ label, onClick, className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${baseStyles} bg-spotify text-white border-2 border-spotify hover:bg-white hover:text-spotify hover:shadow-[0_4px_12px_rgba(29,185,84,0.2)] animate-[subtlePulse_3s_ease-in-out_infinite] ${className}`}
    style={{ borderRadius: '0' }}
  >
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.302c-.216.354-.675.462-1.032.246-2.862-1.749-6.462-2.145-10.704-1.176-.405.093-.81-.159-.903-.564-.093-.405.159-.81.564-.903 4.638-1.062 8.613-.615 11.829 1.344.354.216.465.675.246 1.032zm1.47-3.255c-.273.444-.852.585-1.296.312-3.276-2.013-8.271-2.595-12.147-1.419-.501.153-1.032-.132-1.185-.633-.153-.501.132-1.032.633-1.185 4.431-1.344 9.945-.693 13.686 1.605.444.273.585.852.312 1.293v.007zm.126-3.39c-3.93-2.334-10.419-2.55-14.19-1.407-.603.183-1.242-.162-1.425-.765-.183-.603.162-1.242.765-1.425 4.335-1.314 11.514-1.062 16.002 1.602.54.321.72 1.02.399 1.56-.321.54-1.017.72-1.551.402v-.007z"/>
    </svg>
    {label}
  </button>
);

export const HyperlinkButton: React.FC<{ label: string; onClick?: () => void; active?: boolean }> = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`text-black font-bold uppercase text-[10px] tracking-widest relative group inline-block w-fit ${active ? 'text-accent' : ''}`}
  >
    <span className="relative inline-block overflow-hidden pb-1.5">
      {label}
      <span className={`absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </span>
  </button>
);

export const IconButton: React.FC<{ icon: string; onClick?: () => void; className?: string; title?: string }> = ({ icon, onClick, className = '', title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 active:scale-95 ${className}`}
    style={{ borderRadius: '0' }}
  >
    <span className="material-symbols-sharp text-xl">{icon}</span>
  </button>
);