import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard, FormField } from "./booking-primitives";
import type { Villa } from "@/lib/mock-data";

interface Props {
  villa: Villa;
  form: { name: string; email: string; phone: string; notes: string };
  onChange: (form: { name: string; email: string; phone: string; notes: string }) => void;
  onNext: () => void;
}

export function BookingStepForm({ villa, form, onChange, onNext }: Props) {
  return (
    <div className="space-y-6">
      <SectionCard title="Data Pemesan">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nama Lengkap">
            <Input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} placeholder="Nama sesuai identitas" />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={(e) => onChange({ ...form, email: e.target.value })} placeholder="email@balivio.id" />
          </FormField>
          <FormField label="No. HP">
            <Input value={form.phone} onChange={(e) => onChange({ ...form, phone: e.target.value })} placeholder="+62..." />
          </FormField>
          <FormField label="Catatan (opsional)">
            <Input value={form.notes} onChange={(e) => onChange({ ...form, notes: e.target.value })} placeholder="Late check-in, early breakfast..." />
          </FormField>
        </div>
      </SectionCard>

      <div className="flex justify-between">
        <Link to="/villa/$slug" params={{ slug: villa.slug }}>
          <Button variant="ghost">← Kembali</Button>
        </Link>
        <Button onClick={onNext} disabled={!form.name || !form.email || !form.phone} size="lg" className="rounded-2xl">
          Lanjut ke Pembayaran
        </Button>
      </div>
    </div>
  );
}
