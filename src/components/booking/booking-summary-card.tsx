import { Row } from "./booking-primitives";
import { formatIDR, type Villa } from "@/lib/mock-data";

interface Props {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;
}

export function BookingSummaryCard({
  villa,
  checkIn,
  checkOut,
  guests,
  nights,
  subtotal,
  serviceFee,
  tax,
  total,
}: Props) {
  return (
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
          <Row label="Check-in" value={checkIn} />
          <Row label="Check-out" value={checkOut} />
          <Row label="Tamu" value={`${guests} orang`} />
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
  );
}
