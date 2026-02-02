
import React from 'react';

interface ActionCardProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  label,
  title,
  description,
  children,
  footer,
  centered = false,
  className = ''
}) => {
  return (
    <div className={`relative bg-surface p-10 md:p-16 border-2 border-accent shadow-[12px_12px_0px_0px_rgba(253,71,71,0.05)] overflow-hidden group transition-all duration-500 hover:shadow-[12px_12px_0px_0px_rgba(253,71,71,0.1)] ${centered ? 'text-center flex flex-col items-center' : 'text-left'} ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 dotted-bg opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        {label && (
          <div className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : ''}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{label}</span>
          </div>
        )}
        
        <h2 className="font-playfair text-3xl md:text-6xl mb-6 leading-tight tracking-tight">
          {title}
        </h2>
        
        {description && (
          <p className={`text-gray-500 text-sm md:text-base leading-relaxed mb-10 ${centered ? 'max-w-xl mx-auto' : 'max-w-2xl'}`}>
            {description}
          </p>
        )}
        
        <div className={`flex flex-wrap gap-4 ${centered ? 'justify-center mb-8' : 'mb-0'}`}>
          {children}
        </div>
        
        {footer && (
          <div className={`mt-8 ${centered ? 'w-full' : ''}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
