import { cn } from "@/lib/utils";

interface Props {
  calendarDays: { date: Date; unavailable: boolean }[];
}

export function VillaAvailabilityCalendar({ calendarDays }: Props) {
  return (
    <section>
      <h2 className="text-xl font-bold">Ketersediaan</h2>
      <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
            <span key={i} className="text-muted-foreground font-semibold">
              {d}
            </span>
          ))}
          {calendarDays.map((d, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square grid place-items-center rounded-lg text-xs font-medium",
                d.unavailable
                  ? "bg-muted text-muted-foreground line-through"
                  : "bg-info/30 text-primary",
              )}
            >
              {d.date.getDate()}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-info/30" /> Tersedia
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-muted" /> Terisi
          </span>
        </div>
      </div>
    </section>
  );
}
