
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass p-6 md:p-8 relative overflow-hidden group hover:border-accent transition-colors duration-500 bg-surface/80 ${className}`}>
    <div className="relative z-10">{children}</div>
  </div>
);
