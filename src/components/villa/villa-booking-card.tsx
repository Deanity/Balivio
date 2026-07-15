import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row } from "./villa-primitives";
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
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (val: number) => void;
  onBook: () => void;
}

export function VillaBookingCard({
  villa,
  checkIn,
  checkOut,
  guests,
  nights,
  subtotal,
  serviceFee,
  tax,
  total,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onBook,
}: Props) {
  return (
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
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none"
            />
          </div>
          <div className="rounded-xl bg-muted/40 p-3">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Check-out</p>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none"
            />
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">Tamu</p>
              <p className="text-sm font-medium">{guests} tamu</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{guests}</span>
              <button
                onClick={() => onGuestsChange(Math.min(villa.guests, guests + 1))}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
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

        <Button onClick={onBook} size="lg" className="mt-5 w-full rounded-2xl">
          Booking Sekarang
        </Button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-primary" /> Kamu belum dikenakan biaya
        </p>
      </div>
    </aside>
  );
}
