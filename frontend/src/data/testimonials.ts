export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  villaStayed?: string;
  date?: string;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alifa Rahmadani',
    role: 'Traveler dari Jakarta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Booking villa di Balivio super gampang, harganya paling murah dan customer service-nya cepet banget respon.',
  },
  {
    id: 'test-2',
    name: 'Reza Pratama',
    role: 'Digital Nomad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Filter villa yang detail bikin gampang cari villa yang wifi-nya kencang buat kerja remote di Canggu.',
  },
  {
    id: 'test-3',
    name: 'Sinta & Family',
    role: 'Family Traveler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Kami sekeluarga nginep di villa Uluwatu, semuanya sesuai foto. Free cancellation-nya juga membantu.',
  },
];
