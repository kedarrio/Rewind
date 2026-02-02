
import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-black/5 animate-pulse rounded-none ${className}`}></div>
);

export const SkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-4 bg-black/5 animate-pulse rounded-none w-3/4 mb-2 ${className}`}></div>
);

export const SkeletonCircle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-black/5 animate-pulse rounded-full ${className}`}></div>
);

export const StatsSkeleton: React.FC = () => (
  <div className="space-y-12 w-full">
    <div className="flex gap-4">
      <SkeletonBox className="h-40 w-full" />
      <SkeletonBox className="h-40 w-full" />
      <SkeletonBox className="h-40 w-full" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <SkeletonBox key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);
