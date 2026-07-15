import { Star } from "lucide-react";
import type { Villa } from "@/lib/mock-data";

interface Props {
  reviews: Villa["reviews"];
  rating: number;
  reviewCount: number;
}

export function VillaReviews({ reviews, rating, reviewCount }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold">Review Tamu</h2>
        <span className="text-sm font-semibold text-primary">
          {rating} / 5 ({reviewCount} review)
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" /> {r.rating}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
