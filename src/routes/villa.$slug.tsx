import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Calendar, CalendarDays, Check, MapPin, Minus, Plus, Shield, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { AmenityIcon, amenityLabel } from "@/components/site/amenity-icon";
import { VillaCard } from "@/components/site/villa-card";
import { formatIDR, getVillaBySlug, villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/villa/$slug")({
  loader: ({ params }) => {
    const villa = getVillaBySlug(params.slug);
    if (!villa) throw notFound();
    return { villa };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.villa.name} — Balivio` },
          { name: "description", content: loaderData.villa.description },
          { property: "og:title", content: loaderData.villa.name },
          { property: "og:description", content: loaderData.villa.description },
          { property: "og:image", content: loaderData.villa.images[0] },
        ]
      : [{ title: "Villa tidak ditemukan — Balivio" }, { name: "robots", content: "noindex" }],
  }),
  component: VillaDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Villa tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Villa yang kamu cari tidak tersedia lagi.</p>
        <Link to="/search"><Button className="mt-6">Cari villa lain</Button></Link>
      </div>
    </SiteLayout>
  ),
});

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

function VillaDetail() {
  const { villa } = Route.useLoaderData();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  const nights = daysBetween(checkIn, checkOut);
  const subtotal = villa.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;

  const similar = useMemo(
    () => villas.filter((v) => v.id !== villa.id && v.area === villa.area).slice(0, 3),
    [villa.id, villa.area],
  );

  const goBooking = () => {
    navigate({
      to: "/booking",
      search: {
        villa: villa.slug,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  // Simple availability calendar: next 30 days, mark some as unavailable
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      unavailable: [3, 4, 12, 18, 19].includes(i),
    };
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Beranda</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-foreground">Cari Villa</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{villa.name}</span>
        </nav>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{villa.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {villa.location}</span>
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Star className="h-4 w-4 fill-primary" /> {villa.rating} · {villa.reviewCount} review
              </span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {villa.type}
              </span>
            </div>
          </div>
        </header>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:h-[440px]">
          <div className="overflow-hidden rounded-3xl sm:col-span-2 sm:row-span-2">
            <img src={villa.images[activeImage]} alt={villa.name} className="h-72 w-full object-cover sm:h-full" />
          </div>
          {villa.images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "overflow-hidden rounded-3xl transition-all",
                activeImage === i && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            >
              <img src={img} alt={`${villa.name} ${i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold">Tentang villa ini</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{villa.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Fact icon={<Users className="h-4 w-4" />} label={`${villa.guests} tamu`} />
                <Fact icon={<CalendarDays className="h-4 w-4" />} label={`${villa.bedrooms} kamar`} />
                <Fact icon={<Shield className="h-4 w-4" />} label="Free cancellation" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Fasilitas</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {villa.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-info/30 text-primary">
                      <AmenityIcon id={a} className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{amenityLabel(a)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Kebijakan</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PolicyCard title="Check-in" value={villa.policies.checkIn} />
                <PolicyCard title="Check-out" value={villa.policies.checkOut} />
                <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Cancellation</p>
                  <p className="mt-1 text-sm">{villa.policies.cancellation}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Ketersediaan</h2>
              <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
                    <span key={i} className="text-muted-foreground">{d}</span>
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

            <section>
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold">Review Tamu</h2>
                <span className="text-sm font-semibold text-primary">{villa.rating} / 5 ({villa.reviewCount} review)</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {villa.reviews.map((r, i) => (
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
          </div>

          {/* Booking card */}
          <aside>
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{formatIDR(villa.pricePerNight)}</span>
                <span className="text-sm text-muted-foreground">/ malam</span>
              </div>
              {villa.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">{formatIDR(villa.originalPrice)}</p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-border p-2">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Check-in</p>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none" />
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Check-out</p>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none" />
                </div>
                <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/40 p-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">Tamu</p>
                    <p className="text-sm font-medium">{guests} tamu</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests((n) => Math.max(1, n - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-6 text-center text-sm">{guests}</span>
                    <button onClick={() => setGuests((n) => Math.min(villa.guests, n + 1))} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <Row label={`${formatIDR(villa.pricePerNight)} × ${nights} malam`} value={formatIDR(subtotal)} />
                <Row label="Biaya layanan" value={formatIDR(serviceFee)} />
                <Row label="Pajak" value={formatIDR(tax)} />
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatIDR(total)}</span>
                </div>
              </div>

              <Button onClick={goBooking} size="lg" className="mt-5 w-full rounded-2xl">
                Booking Sekarang
              </Button>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary" /> Kamu belum dikenakan biaya
              </p>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold sm:text-2xl">Villa serupa di {villa.area}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((v) => <VillaCard key={v.id} villa={v} />)}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-info/30 text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function PolicyCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <p className="mt-1 flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary" /> {value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}