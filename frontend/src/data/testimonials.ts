export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  villaStayed: string;
  date: string;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Amanda Rahardjo',
    role: 'Digital Nomad',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Pengalaman booking ter-smooth! Villa di Canggu persis seperti yang di foto, private pool-nya bersih banget dan Wi-Fi kencang untuk kerja.',
    villaStayed: 'Villa Bamboo Sanctuary Canggu',
    date: 'Juni 2026',
  },
  {
    id: 'test-2',
    name: 'Budi Santoso',
    role: 'Family Vacationer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Liburan keluarga 5 hari di Ubud benar-benar tak terlupakan. Anak-anak suka kolam renangnya dan layanannya luar biasa ramah.',
    villaStayed: 'Villa Serenity Jungle Ubud',
    date: 'Mei 2026',
  },
  {
    id: 'test-3',
    name: 'Clara & Kevin',
    role: 'Honeymooners',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Pemandangan sunset dari tebing Uluwatu langsung dari villa kami luar biasa. Balivio membantu honeymoon kami jadi sangat spesial!',
    villaStayed: 'Villa Ocean Haven Uluwatu',
    date: 'Juli 2026',
  },
];
