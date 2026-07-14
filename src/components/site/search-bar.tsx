import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "hero" | "compact";
  initial?: { location?: string; checkIn?: string; checkOut?: string; guests?: number };
  className?: string;
};

export function SearchBar({ variant = "hero", initial, className }: Props) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? today);
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? tomorrow);
  const [guests, setGuests] = useState(initial?.guests ?? 2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: { location, checkIn, checkOut, guests },
    });
  };

  const compact = variant === "compact";

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full rounded-3xl border border-border bg-card/95 p-3 shadow-soft backdrop-blur",
        compact && "shadow-card",
        className,
      )}
    >
      <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto] md:items-stretch">
        <Field icon={<MapPin className="h-4 w-4 text-primary" />} label="Lokasi">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Canggu, Ubud, Seminyak..."
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70"
          />
        </Field>
        <Field icon={<CalendarDays className="h-4 w-4 text-primary" />} label="Check-in">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
          />
        </Field>
        <Field icon={<CalendarDays className="h-4 w-4 text-primary" />} label="Check-out">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
          />
        </Field>
        <Field icon={<Users className="h-4 w-4 text-primary" />} label="Tamu">
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm font-medium outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} tamu
              </option>
            ))}
          </select>
        </Field>
        <Button type="submit" size="lg" className="h-full rounded-2xl px-6">
          <Search className="mr-2 h-4 w-4" /> Cari Villa
        </Button>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3 transition-colors focus-within:bg-muted">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}