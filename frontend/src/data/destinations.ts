export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  villaCount: number;
  image: string;
  popularTagline: string;
}

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'dest-canggu',
    name: 'Canggu',
    slug: 'canggu',
    description: 'Pusat gaya hidup tropis dengan beach club ternama, cafe modern, & surf spot terbaik.',
    villaCount: 120,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    popularTagline: 'SURF & SUNSET SPOT',
  },
  {
    id: 'dest-ubud',
    name: 'Ubud',
    slug: 'ubud',
    description: 'Suasana tenang di tengah hutan tropis, sawah terasering, & pusat seni budaya Bali.',
    villaCount: 75,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    popularTagline: 'GREEN JUNGLE RETREAT',
  },
  {
    id: 'dest-seminyak',
    name: 'Seminyak',
    slug: 'seminyak',
    description: 'Kawasan mewah dengan restoran bintang lima, boutique shopping, & sunset indah.',
    villaCount: 94,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
    popularTagline: 'CHIC & TRENDY VIBES',
  },
  {
    id: 'dest-uluwatu',
    name: 'Uluwatu',
    slug: 'uluwatu',
    description: 'Tebing dramatis menghadap Samudra Hindia, cliffside beach club, & pantai rahasia.',
    villaCount: 63,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    popularTagline: 'CLIFFSIDE OCEAN VIEW',
  },
];
