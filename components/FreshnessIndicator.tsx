
import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { SuccessButton } from './Buttons';

interface FreshnessIndicatorProps {
  label: string;
  lastUpdated: string | null;
  onRefresh: () => void;
  isLoading?: boolean;
  type: 'stats' | 'report';
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({
  label,
  lastUpdated,
  onRefresh,
  isLoading,
  type
}) => {
  if (!lastUpdated) return null;

  const cooldownHours = type === 'stats' ? 12 : 24;
  const nextAvailableAt = new Date(new Date(lastUpdated).getTime() + cooldownHours * 60 * 60 * 1000).toISOString();
  const isAvailable = new Date().getTime() >= new Date(nextAvailableAt).getTime();
  
  const timeAgoStr = () => {
    const mins = Math.floor((new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`glass p-4 md:p-6 bg-surface/80 border-l-4 ${isAvailable ? 'border-success' : 'border-black/5'} flex flex-col sm:flex-row items-center justify-between gap-4 mb-8`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAvailable ? 'bg-success/10' : 'bg-accent/5'}`}>
          <span className={`material-symbols-sharp ${isAvailable ? 'text-success' : 'text-accent'}`}>
            {isAvailable ? 'check_circle' : 'schedule'}
          </span>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">{label}</h4>
          <p className="text-xs font-medium">Last synced {timeAgoStr()}</p>
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-end gap-2">
        {isAvailable ? (
          <SuccessButton 
            label={type === 'stats' ? "Sync Data" : "New Report"} 
            onClick={onRefresh} 
            className="!px-6 !py-2 text-[10px]"
            icon={isLoading ? "sync" : "refresh"}
            disabled={isLoading}
          />
        ) : (
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-black/20">Next update in</span>
              <CountdownTimer targetTime={nextAvailableAt} />
            </div>
            <p className="text-[8px] uppercase tracking-widest text-black/30 text-center sm:text-right max-w-[200px]">
              {type === 'report' ? 'AI reports update once every 24 hours.' : 'Stats update once every 12 hours.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
