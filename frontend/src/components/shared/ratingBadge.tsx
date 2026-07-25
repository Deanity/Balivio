import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  className?: string;
  showReviewsText?: boolean;
}

export function RatingBadge({
  rating,
  reviewCount,
  className,
  showReviewsText = true,
}: RatingBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1 text-slate-800 text-sm font-medium', className)}>
      <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
      <span className="font-semibold text-slate-900">{rating.toFixed(2)}</span>
      {reviewCount !== undefined && showReviewsText && (
        <span className="text-slate-500 text-xs font-normal">({reviewCount} ulasan)</span>
      )}
    </div>
  );
}
