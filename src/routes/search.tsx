import { createFileRoute, redirect } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { SearchBar } from "@/components/site/search-bar";
import { VillaCard } from "@/components/site/villa-card";
import { villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getStoredUser } from "@/hooks/use-auth";

// Components
import { SearchFilters } from "@/components/search/search-filters";

type Search = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  sort?: "recommended" | "price_asc" | "rating_desc";
};

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Cari Villa — Balivio" },
      { name: "description", content: "Temukan villa terbaik di Bali sesuai preferensimu." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    location: typeof s.location === "string" ? s.location : undefined,
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : Number(s.guests) || undefined,
    sort: (s.sort as Search["sort"]) ?? "recommended",
  }),
  component: SearchPage,
  beforeLoad: () => {
    if (!getStoredUser()) throw redirect({ to: "/login" });
  },
});

function SearchPage() {
  const search = Route.useSearch();
  const [priceRange, setPriceRange] = useState<[number, number]>([1000000, 7000000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(search.location ? [search.location] : []);
  const [sort, setSort] = useState<Search["sort"]>(search.sort ?? "recommended");

  const filtered = useMemo(() => {
    let list = villas.filter((v) => {
      if (v.pricePerNight < priceRange[0] || v.pricePerNight > priceRange[1]) return false;
      if (v.rating < minRating) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => v.amenities.includes(a))) return false;
      if (selectedTypes.length && !selectedTypes.includes(v.type)) return false;
      if (selectedAreas.length && !selectedAreas.some((a) => v.area.toLowerCase().includes(a.toLowerCase()))) return false;
      if (search.guests && v.guests < search.guests) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === "rating_desc") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [priceRange, minRating, selectedAmenities, selectedTypes, selectedAreas, sort, search.guests]);

  const clearFilters = () => {
    setPriceRange([1000000, 7000000]);
    setMinRating(0);
    setSelectedAmenities([]);
    setSelectedTypes([]);
    setSelectedAreas([]);
  };

  const filterProps = {
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    selectedAmenities,
    setSelectedAmenities,
    selectedTypes,
    setSelectedTypes,
    selectedAreas,
    setSelectedAreas,
    clearFilters,
  };

  return (
    <SiteLayout>
      {/* Sticky search bar */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar
            variant="compact"
            initial={{
              location: search.location,
              checkIn: search.checkIn,
              checkOut: search.checkOut,
              guests: search.guests,
            }}
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        {/* Sidebar filter (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-48 rounded-3xl border border-border bg-card p-6 shadow-card">
            <SearchFilters {...filterProps} />
          </div>
        </aside>

        <div>
          {/* Sorting bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                {filtered.length} villa ditemukan
                {search.location ? ` di ${search.location}` : ""}
              </h1>
              <p className="text-xs text-muted-foreground">
                Menampilkan villa terbaik sesuai filter kamu.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle>Filter Pencarian</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <SearchFilters {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="relative flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Search["sort"])}
                  className="bg-transparent text-xs font-medium outline-none"
                >
                  <option value="recommended">Rekomendasi</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="rating_desc">Rating Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {selectedAreas.length || selectedAmenities.length || selectedTypes.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {[...selectedAreas, ...selectedTypes, ...selectedAmenities].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {c}
                  <button
                    onClick={() => {
                      setSelectedAreas((s) => s.filter((x) => x !== c));
                      setSelectedAmenities((s) => s.filter((x) => x !== c));
                      setSelectedTypes((s) => s.filter((x) => x !== c));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          {/* Results */}
          <div className="mt-6 flex flex-col gap-6">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <p className="text-base font-semibold">Tidak ada villa yang cocok</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Coba longgarkan filter atau ubah lokasi pencarian.
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Reset filter
                </Button>
              </div>
            ) : (
              filtered.map((v) => <VillaCard key={v.id} villa={v} layout="list" />)
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}