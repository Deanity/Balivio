export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Cari Villa', href: '/searchVilla' },
  { label: 'Destinasi', href: '/#destinasi' },
  { label: 'Mengapa Balivio', href: '/#mengapa' },
  { label: 'Booking Saya', href: '/bookingSaya' },
];
