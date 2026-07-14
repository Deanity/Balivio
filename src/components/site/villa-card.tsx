import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { AmenityIcon } from "./amenity-icon";
import { formatIDR, type Villa } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function VillaCard({ villa, layout = "grid", requireAuth = false }: { villa: Villa; layout?: "grid" | "list"; requireAuth?: boolean }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const list = layout === "list";
  const navigate = useNavigate();

  const handleDetail = () => {
    if (requireAuth) {
      navigate({ to: "/login" });
    } else {
      navigate({ to: "/villa/$slug", params: { slug: villa.slug } });
    }
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover:shadow-soft",
        list ? "grid gap-0 md:grid-cols-[280px_1fr]" : "flex flex-col",
      )}
    >
      <div className={cn("relative overflow-hidden", list ? "h-56 md:h-full" : "h-56")}>
        <img
          src={villa.images[imgIdx]}
          alt={villa.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {villa.discountPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground shadow-sm">
            -{villa.discountPercent}%
          </span>
        ) : null}
        {villa.badges?.[0] ? (
          <span className="absolute left-3 top-11 rounded-full bg-primary/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
            {villa.badges[0]}
          </span>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked((v) => !v);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform hover:scale-110"
          aria-label="Save"
        >
          <Heart className={cn("h-4 w-4", liked && "fill-destructive text-destructive")} />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {villa.images.slice(0, 4).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setImgIdx(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                imgIdx === i ? "w-6 bg-background" : "w-1.5 bg-background/60",
              )}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-5", list && "md:gap-4 md:p-6")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{villa.name}</h3>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {villa.location}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" /> {villa.rating}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {villa.amenities.slice(0, 4).map((a) => (
            <span key={a} className="flex items-center gap-1.5">
              <AmenityIcon id={a} className="h-3.5 w-3.5 text-primary" />
            </span>
          ))}
          <span>· {villa.bedrooms} kamar</span>
          <span>· {villa.reviewCount} review</span>
        </div>

        {list && <p className="line-clamp-2 text-sm text-muted-foreground">{villa.description}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            {villa.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatIDR(villa.originalPrice)}</p>
            )}
            <p className="text-lg font-bold text-primary">
              {formatIDR(villa.pricePerNight)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ malam</span>
            </p>
          </div>
          <Button size="sm" className="rounded-full" onClick={handleDetail}>
            Lihat Detail
          </Button>
        </div>
      </div>
    </article>
  );
}