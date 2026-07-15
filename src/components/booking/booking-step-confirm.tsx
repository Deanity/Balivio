import { CheckCircle2, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InvoiceRow } from "./booking-primitives";
import { formatIDR, type Villa } from "@/lib/mock-data";

interface Props {
  form: { name: string; email: string };
  bookingId: string;
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
}

export function BookingStepConfirm({
  form,
  bookingId,
  villa,
  checkIn,
  checkOut,
  guests,
  total,
}: Props) {
  return (
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
          <InvoiceRow label="Check-in" value={checkIn} />
          <InvoiceRow label="Check-out" value={checkOut} />
          <InvoiceRow label="Tamu" value={`${guests} orang`} />
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
  );
}
