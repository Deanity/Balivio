import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Shield, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { AmenityIcon, amenityLabel } from "@/components/site/amenity-icon";
import { VillaCard } from "@/components/site/villa-card";
import { formatIDR, getVillaBySlug, villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

// Custom Villa Components
import { Fact, PolicyCard } from "@/components/villa/villa-primitives";
import { VillaGallery } from "@/components/villa/villa-gallery";
import { VillaBookingCard } from "@/components/villa/villa-booking-card";
import { VillaReviews } from "@/components/villa/villa-reviews";
import { VillaAvailabilityCalendar } from "@/components/villa/villa-calendar";

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
        <Link to="/search">
          <Button className="mt-6">Cari villa lain</Button>
        </Link>
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
  const calendarDays = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        date: d,
        unavailable: [3, 4, 12, 18, 19].includes(i),
      };
    });
  }, []);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-foreground">
            Cari Villa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{villa.name}</span>
        </nav>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{villa.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {villa.location}
              </span>
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
        <VillaGallery
          images={villa.images}
          name={villa.name}
          activeImage={activeImage}
          onSelectImage={setActiveImage}
        />

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
                {villa.amenities.map((a: string) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                  >
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

            {/* Availability calendar */}
            <VillaAvailabilityCalendar calendarDays={calendarDays} />

            {/* Reviews */}
            <VillaReviews
              reviews={villa.reviews}
              rating={villa.rating}
              reviewCount={villa.reviewCount}
            />
          </div>

          {/* Booking card */}
          <VillaBookingCard
            villa={villa}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            nights={nights}
            subtotal={subtotal}
            serviceFee={serviceFee}
            tax={tax}
            total={total}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onGuestsChange={setGuests}
            onBook={goBooking}
          />
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold sm:text-2xl">Villa serupa di {villa.area}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((v) => (
                <VillaCard key={v.id} villa={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}