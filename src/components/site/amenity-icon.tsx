import { Waves, Wifi, Wind, Coffee, Car, ChefHat, Dumbbell, Palmtree, type LucideIcon } from "lucide-react";

const map: Record<string, { icon: LucideIcon; label: string }> = {
  pool: { icon: Waves, label: "Private Pool" },
  wifi: { icon: Wifi, label: "Wifi Cepat" },
  ac: { icon: Wind, label: "AC" },
  breakfast: { icon: Coffee, label: "Breakfast" },
  parking: { icon: Car, label: "Parkir" },
  kitchen: { icon: ChefHat, label: "Dapur" },
  gym: { icon: Dumbbell, label: "Gym" },
  beach: { icon: Palmtree, label: "Beach Access" },
};

export const amenityList = Object.entries(map).map(([key, v]) => ({ key, label: v.label }));

export function AmenityIcon({ id, className }: { id: string; className?: string }) {
  const item = map[id];
  if (!item) return null;
  const Icon = item.icon;
  return <Icon className={className} aria-label={item.label} />;
}

export function amenityLabel(id: string) {
  return map[id]?.label ?? id;
}