import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Building2, CheckCircle2, CreditCard, Download, Landmark, Smartphone, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { Stepper } from "@/components/site/stepper";
import { formatIDR, getVillaBySlug, villas } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getStoredUser } from "@/hooks/use-auth";

type Search = {
  villa?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  step?: number;
};

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Booking — Balivio" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    villa: typeof s.villa === "string" ? s.villa : undefined,
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : Number(s.guests) || undefined,
    step: typeof s.step === "number" ? s.step : Number(s.step) || 0,
  }),
  component: BookingPage,
  beforeLoad: () => {
    if (!getStoredUser()) throw redirect({ to: "/login" });
  },
});

const STEPS = ["Ringkasan & Data Diri", "Pembayaran", "Konfirmasi"];

function daysBetween(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function BookingPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const villa = useMemo(() => (search.villa ? getVillaBySlug(search.villa) : villas[0]) ?? villas[0], [search.villa]);

  const step = search.step ?? 0;
  const setStep = (n: number) => navigate({ to: "/booking", search: { ...search, step: n } });

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [payment, setPayment] = useState<"transfer" | "card" | "ewallet">("transfer");

  const nights = daysBetween(search.checkIn ?? new Date().toISOString().slice(0, 10), search.checkOut ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const subtotal = villa.pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;

  const bookingId = useMemo(() => "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
          <Stepper steps={STEPS} current={step} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {step === 0 && (
              <div className="space-y-6">
                <SectionCard title="Data Pemesan">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Nama Lengkap">
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama sesuai identitas" />
                    </FormField>
                    <FormField label="Email">
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@balivio.id" />
                    </FormField>
                    <FormField label="No. HP">
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62..." />
                    </FormField>
                    <FormField label="Catatan (opsional)">
                      <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Late check-in, early breakfast..." />
                    </FormField>
                  </div>
                </SectionCard>

                <div className="flex justify-between">
                  <Link to="/villa/$slug" params={{ slug: villa.slug }}>
                    <Button variant="ghost">← Kembali</Button>
                  </Link>
                  <Button
                    onClick={() => setStep(1)}
                    disabled={!form.name || !form.email || !form.phone}
                    size="lg"
                    className="rounded-2xl"
                  >
                    Lanjut ke Pembayaran
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <SectionCard title="Metode Pembayaran">
                  <div className="grid gap-3">
                    <PayMethod id="transfer" active={payment === "transfer"} onClick={() => setPayment("transfer")} icon={<Landmark className="h-5 w-5" />} title="Transfer Bank" subtitle="BCA, Mandiri, BRI, BNI" />
                    <PayMethod id="card" active={payment === "card"} onClick={() => setPayment("card")} icon={<CreditCard className="h-5 w-5" />} title="Kartu Kredit / Debit" subtitle="Visa, Mastercard, JCB" />
                    <PayMethod id="ewallet" active={payment === "ewallet"} onClick={() => setPayment("ewallet")} icon={<Wallet className="h-5 w-5" />} title="E-Wallet" subtitle="GoPay, OVO, DANA, ShopeePay" />
                  </div>

                  {payment === "card" && (
                    <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                      <FormField label="Nomor Kartu">
                        <Input placeholder="1234 5678 9012 3456" />
                      </FormField>
                      <FormField label="Nama di Kartu">
                        <Input placeholder="Nama pemegang kartu" />
                      </FormField>
                      <FormField label="Expiry">
                        <Input placeholder="MM/YY" />
                      </FormField>
                      <FormField label="CVV">
                        <Input placeholder="123" />
                      </FormField>
                    </div>
                  )}
                  {payment === "transfer" && (
                    <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4">
                      <p className="flex items-center gap-2 text-sm font-medium"><Building2 className="h-4 w-4 text-primary" /> BCA Virtual Account</p>
                      <p className="mt-2 text-lg font-bold tracking-wider">8808 {bookingId.replace(/[^0-9]/g, "").padStart(10, "0").slice(0, 10)}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Selesaikan pembayaran dalam 1 jam.</p>
                    </div>
                  )}
                  {payment === "ewallet" && (
                    <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                      {["GoPay", "OVO", "DANA", "ShopeePay"].map((w) => (
                        <button key={w} className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:border-primary">
                          <Smartphone className="mx-auto mb-1 h-4 w-4 text-primary" />
                          {w}
                        </button>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(0)}>← Kembali</Button>
                  <Button onClick={() => setStep(2)} size="lg" className="rounded-2xl">
                    Bayar {formatIDR(total)}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/30 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">Booking Berhasil!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Terima kasih {form.name || "traveler"}. E-voucher telah dikirim ke email {form.email || "kamu"}.
                </p>

                <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Booking ID</p>
                      <p className="text-lg font-bold">{bookingId}</p>
                    </div>
                    <span className="rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">PAID</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <InvoiceRow label="Villa" value={villa.name} />
                    <InvoiceRow label="Lokasi" value={villa.location} />
                    <InvoiceRow label="Check-in" value={search.checkIn ?? "-"} />
                    <InvoiceRow label="Check-out" value={search.checkOut ?? "-"} />
                    <InvoiceRow label="Tamu" value={`${search.guests ?? 2} orang`} />
                    <InvoiceRow label="Total" value={formatIDR(total)} />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" className="rounded-2xl">
                    <Download className="mr-2 h-4 w-4" /> Unduh Invoice
                  </Button>
                  <Link to="/my-bookings">
                    <Button className="rounded-2xl">Lihat Booking Saya</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside>
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-4">
                <img src={villa.images[0]} alt={villa.name} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{villa.type}</p>
                  <p className="truncate text-sm font-semibold">{villa.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{villa.location}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <Row label="Check-in" value={search.checkIn ?? "-"} />
                <Row label="Check-out" value={search.checkOut ?? "-"} />
                <Row label="Tamu" value={`${search.guests ?? 2} orang`} />
                <Row label="Durasi" value={`${nights} malam`} />
              </div>
              <div className="my-4 border-t border-border" />
              <div className="space-y-2 text-sm">
                <Row label={`${formatIDR(villa.pricePerNight)} × ${nights}`} value={formatIDR(subtotal)} />
                <Row label="Biaya layanan" value={formatIDR(serviceFee)} />
                <Row label="Pajak" value={formatIDR(tax)} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatIDR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PayMethod({ id, active, onClick, icon, title, subtitle }: { id: string; active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      key={id}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
      )}
    >
      <span className={cn("grid h-10 w-10 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", active ? "border-primary" : "border-border")}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
    </button>
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

function InvoiceRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}