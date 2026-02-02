
import React from 'react';

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12">
    {subtitle && <span className="text-accent uppercase tracking-[0.3em] font-bold text-[10px]">{subtitle}</span>}
    <h2 className="font-playfair text-3xl md:text-5xl mt-3">{title}</h2>
  </div>
);
