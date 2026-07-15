import { Calendar } from "lucide-react";

export function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-info/30 text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function PolicyCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <p className="mt-1 flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-primary" /> {value}
      </p>
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
