import React from 'react';
import { useInView } from 'react-intersection-observer';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  threshold = 0.1
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'none';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0, 0)' : getInitialTransform(),
        transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
      className={className}
    >
      {children}
    </div>
  );
};