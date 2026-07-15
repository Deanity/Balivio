import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { amenityList } from "@/components/site/amenity-icon";

const villaTypes = ["Private Villa", "Boutique Villa", "Family Villa", "Luxury Villa"] as const;
const areas = ["Canggu", "Ubud", "Seminyak", "Uluwatu", "Nusa Dua", "Sanur"];

interface Props {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[] | ((prev: string[]) => string[])) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[] | ((prev: string[]) => string[])) => void;
  selectedAreas: string[];
  setSelectedAreas: (areas: string[] | ((prev: string[]) => string[])) => void;
  clearFilters: () => void;
}

export function SearchFilters({
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
}: Props) {
  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
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
            <label key={t} className="flex items-center gap-3 text-sm cursor-pointer select-none">
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
            <label key={a.key} className="flex items-center gap-3 text-sm cursor-pointer select-none">
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
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5 first-of-type:border-t-0 first-of-type:pt-0">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}
