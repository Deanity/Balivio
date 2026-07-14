import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeadphonesIcon, Quote, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { SearchBar } from "@/components/site/search-bar";
import { VillaCard } from "@/components/site/villa-card";
import { DestinationCard } from "@/components/site/destination-card";
import { destinations, testimonials, villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const perks = [
  { icon: Tag, title: "Harga Terbaik", desc: "Jaminan harga paling kompetitif untuk setiap villa di Bali." },
  { icon: ShieldCheck, title: "Free Cancellation", desc: "Batalkan gratis hingga hari yang telah ditentukan." },
  { icon: BadgeCheck, title: "Verified Villa", desc: "Setiap villa dikurasi & diverifikasi tim lokal kami." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Tim support siap membantumu kapanpun dibutuhkan." },
];

function Index() {
  const featured = villas.slice(0, 8);
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1920&q=80"
            alt="Villa di Bali"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-black/30 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-44 lg:pt-36">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-highlight/95 px-4 py-1.5 text-xs font-bold text-highlight-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Promo spesial hingga 30% off
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Rasakan liburan sempurna di villa terbaik Bali.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
              Kurasi villa private pool, retreat pegunungan, hingga clifftop suite — semuanya bisa kamu booking dalam hitungan menit.
            </p>
          </div>
          <div className="mt-8 lg:mt-14">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* DESTINASI POPULER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Destinasi Populer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Area favorit para traveler di Pulau Dewata.
            </p>
          </div>
          <Link to="/search" className="hidden text-sm font-semibold text-primary hover:underline sm:block">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-8 -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {destinations.map((d) => (
            <div key={d.name} className="snap-start">
              <DestinationCard {...d} />
            </div>
          ))}
        </div>
      </section>

      {/* VILLA REKOMENDASI */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Villa Rekomendasi</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pilihan villa dengan rating terbaik dari tamu.
            </p>
          </div>
          <Link to="/search">
            <Button variant="outline" className="rounded-full">Lihat Semua Villa</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((v) => (
            <VillaCard key={v.id} villa={v} />
          ))}
        </div>
      </section>

      {/* KENAPA BALIVIO */}
      <section className="mx-auto mt-8 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-surface-alt p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Kenapa pilih Balivio?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Pengalaman booking villa yang simpel, transparan, dan bikin tenang dari awal sampai check-out.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-info/40 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Kata mereka yang sudah menginap</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Ribuan tamu bahagia setiap bulannya. Berikut beberapa cerita mereka.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <Quote className="h-6 w-6 text-primary/60" />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
