import { createFileRoute } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { SearchBar } from "@/components/site/search-bar";
import { VillaCard } from "@/components/site/villa-card";
import { amenityList } from "@/components/site/amenity-icon";
import { villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Search = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  sort?: "recommended" | "price_asc" | "rating_desc";
};

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [{ title: "Cari Villa — Balivio" }, { name: "description", content: "Temukan villa terbaik di Bali sesuai preferensimu." }],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    location: typeof s.location === "string" ? s.location : undefined,
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : Number(s.guests) || undefined,
    sort: (s.sort as Search["sort"]) ?? "recommended",
  }),
  component: SearchPage,
});

const villaTypes = ["Private Villa", "Boutique Villa", "Family Villa", "Luxury Villa"] as const;
const areas = ["Canggu", "Ubud", "Seminyak", "Uluwatu", "Nusa Dua", "Sanur"];

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

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const FiltersPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Filter</h3>
        <button onClick={clearFilters} className="text-xs font-medium text-primary hover:underline">
          Reset
        </button>
      </div>

      <FilterGroup title="Rentang Harga (per malam)">
        <div className="px-1">
          <Slider
            value={priceRange}
            min={500000}
            max={8000000}
            step={100000}
            onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
          />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>Rp {(priceRange[0] / 1_000_000).toFixed(1)}jt</span>
            <span>Rp {(priceRange[1] / 1_000_000).toFixed(1)}jt</span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Lokasi">
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAreas((s) => toggle(s, a))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedAreas.includes(a)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/60",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating minimum">
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                minRating === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/60",
              )}
            >
              {r === 0 ? "Semua" : `${r}+`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Tipe Villa">
        <div className="space-y-2">
          {villaTypes.map((t) => (
            <label key={t} className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={selectedTypes.includes(t)}
                onCheckedChange={() => setSelectedTypes((s) => toggle(s, t))}
              />
              {t}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Fasilitas">
        <div className="space-y-2">
          {amenityList.map((a) => (
            <label key={a.key} className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={selectedAmenities.includes(a.key)}
                onCheckedChange={() => setSelectedAmenities((s) => toggle(s, a.key))}
              />
              {a.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

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
            {FiltersPanel}
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
                  <div className="mt-4">{FiltersPanel}</div>
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
          {(selectedAreas.length || selectedAmenities.length || selectedTypes.length) ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {[...selectedAreas, ...selectedTypes, ...selectedAmenities].map((c) => (
                <span key={c} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
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
                <p className="mt-2 text-sm text-muted-foreground">Coba longgarkan filter atau ubah lokasi pencarian.</p>
                <Button onClick={clearFilters} className="mt-4">Reset filter</Button>
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5 first-of-type:border-t-0 first-of-type:pt-0">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}