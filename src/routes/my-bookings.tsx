import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { formatIDR, getVillaById, mockBookings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({ meta: [{ title: "Booking Saya — Balivio" }, { name: "robots", content: "noindex" }] }),
  component: MyBookings,
});

function MyBookings() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">Booking Saya</h1>
          <p className="mt-2 text-sm text-muted-foreground">Kelola dan lihat riwayat pemesanan villa kamu.</p>
        </header>

        <div className="mt-8 space-y-5">
          {mockBookings.map((b) => {
            const v = getVillaById(b.villaId)!;
            return (
              <article key={b.id} className="grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-[220px_1fr_auto]">
                <img src={v.images[0]} alt={v.name} className="h-48 w-full object-cover md:h-full" />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">{b.id}</span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                        b.status === "Upcoming"
                          ? "bg-highlight text-highlight-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{v.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {v.location}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-primary" /> {b.checkIn} → {b.checkOut}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> {b.guests} tamu</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3 border-t border-border p-5 md:border-l md:border-t-0">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-primary">{formatIDR(b.total)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to="/villa/$slug" params={{ slug: v.slug }}>
                      <Button variant="outline" size="sm" className="w-full rounded-full">Lihat Villa</Button>
                    </Link>
                    {b.status === "Upcoming" && (
                      <Button size="sm" className="w-full rounded-full">E-Voucher</Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}