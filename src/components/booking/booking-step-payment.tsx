import { Building2, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard, FormField, PayMethod } from "./booking-primitives";
import { formatIDR } from "@/lib/mock-data";

interface Props {
  payment: "transfer" | "card" | "ewallet";
  onChangePayment: (type: "transfer" | "card" | "ewallet") => void;
  total: number;
  bookingId: string;
  onBack: () => void;
  onNext: () => void;
}

export function BookingStepPayment({
  payment,
  onChangePayment,
  total,
  bookingId,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      <SectionCard title="Metode Pembayaran">
        <div className="grid gap-3">
          <PayMethod
            id="transfer"
            active={payment === "transfer"}
            onClick={() => onChangePayment("transfer")}
            icon={<Landmark className="h-5 w-5" />}
            title="Transfer Bank"
            subtitle="BCA, Mandiri, BRI, BNI"
          />
          <PayMethod
            id="card"
            active={payment === "card"}
            onClick={() => onChangePayment("card")}
            icon={<CreditCard className="h-5 w-5" />}
            title="Kartu Kredit / Debit"
            subtitle="Visa, Mastercard, JCB"
          />
          <PayMethod
            id="ewallet"
            active={payment === "ewallet"}
            onClick={() => onChangePayment("ewallet")}
            icon={<Wallet className="h-5 w-5" />}
            title="E-Wallet"
            subtitle="GoPay, OVO, DANA, ShopeePay"
          />
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
            <p className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-primary" /> BCA Virtual Account
            </p>
            <p className="mt-2 text-lg font-bold tracking-wider">
              8808 {bookingId.replace(/[^0-9]/g, "").padStart(10, "0").slice(0, 10)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Selesaikan pembayaran dalam 1 jam.</p>
          </div>
        )}

        {payment === "ewallet" && (
          <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-muted/30 p-4">
            {["GoPay", "OVO", "DANA", "ShopeePay"].map((w) => (
              <button
                key={w}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:border-primary"
              >
                <Smartphone className="mx-auto mb-1 h-4 w-4 text-primary" />
                {w}
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Kembali
        </Button>
        <Button onClick={onNext} size="lg" className="rounded-2xl">
          Bayar {formatIDR(total)}
        </Button>
      </div>
    </div>
  );
}
