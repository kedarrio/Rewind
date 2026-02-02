
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: string; // ISO string
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetTime).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('READY');
        onComplete?.();
        return false;
      }

      const h = Math.floor(difference / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      if (h > 0) {
        setTimeLeft(`${h}h ${m}m`);
      } else {
        setTimeLeft(`${m}m ${s}s`);
      }
      return true;
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      if (!calculateTimeLeft()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, onComplete]);

  return (
    <span className="font-mono font-bold text-accent">{timeLeft}</span>
  );
};
