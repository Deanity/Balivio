import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { Stepper } from "@/components/site/stepper";
import { getVillaBySlug, villas } from "@/lib/mock-data";
import { getStoredUser } from "@/hooks/use-auth";

// Components
import { BookingStepForm } from "@/components/booking/booking-step-form";
import { BookingStepPayment } from "@/components/booking/booking-step-payment";
import { BookingStepConfirm } from "@/components/booking/booking-step-confirm";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";

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

  const checkInDate = search.checkIn ?? new Date().toISOString().slice(0, 10);
  const checkOutDate = search.checkOut ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const guestsNum = search.guests ?? 2;

  const nights = daysBetween(checkInDate, checkOutDate);
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
              <BookingStepForm
                villa={villa}
                form={form}
                onChange={setForm}
                onNext={() => setStep(1)}
              />
            )}

            {step === 1 && (
              <BookingStepPayment
                payment={payment}
                onChangePayment={setPayment}
                total={total}
                bookingId={bookingId}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <BookingStepConfirm
                form={form}
                bookingId={bookingId}
                villa={villa}
                checkIn={checkInDate}
                checkOut={checkOutDate}
                guests={guestsNum}
                total={total}
              />
            )}
          </div>

          <BookingSummaryCard
            villa={villa}
            checkIn={checkInDate}
            checkOut={checkOutDate}
            guests={guestsNum}
            nights={nights}
            subtotal={subtotal}
            serviceFee={serviceFee}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </SiteLayout>
  );
}