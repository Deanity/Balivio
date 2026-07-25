import React from 'react';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  pricePerNight: number;
  originalPricePerNight?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({
  pricePerNight,
  originalPricePerNight,
  className,
  size = 'md',
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold text-[#0D5C54]',
  };

  return (
    <div className={cn('flex items-baseline gap-1.5', className)}>
      <div className="flex items-baseline gap-1">
        <span className={cn('font-bold text-slate-900', sizeClasses[size])}>
          {formatCurrency(pricePerNight)}
        </span>
        <span className="text-xs text-slate-500 font-normal">/ malam</span>
      </div>

      {originalPricePerNight && originalPricePerNight > pricePerNight && (
        <span className="text-xs text-slate-400 line-through">
          {formatCurrency(originalPricePerNight)}
        </span>
      )}
    </div>
  );
}
