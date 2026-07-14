export type Villa = {
  id: string;
  slug: string;
  name: string;
  location: string; // area, e.g. "Canggu, Bali"
  area: string; // e.g. "Canggu"
  description: string;
  images: string[];
  pricePerNight: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  guests: number;
  type: "Private Villa" | "Boutique Villa" | "Family Villa" | "Luxury Villa";
  amenities: string[]; // keys: pool, wifi, ac, breakfast, parking, kitchen, gym, beach
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  reviews: { name: string; rating: number; date: string; comment: string; avatar?: string }[];
  badges?: string[];
};

const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const destinations = [
  {
    name: "Canggu",
    tagline: "Surf & sunset spot",
    image: img("photo-1518544801976-3e159e50e5bb"),
    villas: 128,
  },
  {
    name: "Ubud",
    tagline: "Green jungle retreat",
    image: img("photo-1512100356356-de1b84283e18"),
    villas: 96,
  },
  {
    name: "Seminyak",
    tagline: "Chic & trendy vibes",
    image: img("photo-1571003123894-1f0594d2b5d9"),
    villas: 84,
  },
  {
    name: "Uluwatu",
    tagline: "Cliffside ocean view",
    image: img("photo-1540541338287-41700207dee6"),
    villas: 62,
  },
  {
    name: "Nusa Dua",
    tagline: "Family-friendly beaches",
    image: img("photo-1582719508461-905c673771fd"),
    villas: 45,
  },
  {
    name: "Sanur",
    tagline: "Calm sunrise coast",
    image: img("photo-1573790387438-4da905039392"),
    villas: 38,
  },
];

export const villas: Villa[] = [
  {
    id: "v1",
    slug: "villa-ombak-canggu",
    name: "Villa Ombak Canggu",
    location: "Berawa, Canggu",
    area: "Canggu",
    description:
      "Villa modern dengan private pool menghadap sawah, hanya 5 menit dari Berawa Beach. Cocok untuk pasangan atau grup kecil yang ingin merasakan chill vibe Canggu.",
    images: [
      img("photo-1582268611958-ebfd161df9d8"),
      img("photo-1613490493576-7fde63acd811"),
      img("photo-1540541338287-41700207dee6"),
      img("photo-1512918728675-ed5a9ecdebfd"),
    ],
    pricePerNight: 2450000,
    originalPrice: 3200000,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 128,
    bedrooms: 2,
    guests: 4,
    type: "Private Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "kitchen"],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Free cancellation hingga 7 hari sebelum check-in.",
    },
    reviews: [
      { name: "Rani Putri", rating: 5, date: "Mei 2026", comment: "Villanya bersih banget, view sawah sunset-nya juara. Host responsif dan breakfast enak!" },
      { name: "Andi W.", rating: 5, date: "April 2026", comment: "Lokasi strategis, dekat cafe hits Canggu. Pasti balik lagi." },
      { name: "Sarah L.", rating: 4, date: "Maret 2026", comment: "Overall bagus, kolam private cocok buat santai seharian." },
    ],
    badges: ["Promo"],
  },
  {
    id: "v2",
    slug: "ubud-jungle-retreat",
    name: "Ubud Jungle Retreat",
    location: "Tegallalang, Ubud",
    area: "Ubud",
    description:
      "Retreat tropis di tengah rice terrace Tegallalang. Wake up dengan suara burung dan yoga deck di antara pepohonan.",
    images: [
      img("photo-1540541338287-41700207dee6"),
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1602002418082-a4443e081dd1"),
      img("photo-1566073771259-6a8506099945"),
    ],
    pricePerNight: 3100000,
    rating: 4.8,
    reviewCount: 94,
    bedrooms: 3,
    guests: 6,
    type: "Boutique Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "kitchen", "gym"],
    policies: { checkIn: "15:00", checkOut: "12:00", cancellation: "Free cancellation hingga 5 hari sebelum check-in." },
    reviews: [
      { name: "Mira S.", rating: 5, date: "Juni 2026", comment: "Pemandangan sawahnya bikin healing. Staff ramah." },
      { name: "Bagus P.", rating: 5, date: "Mei 2026", comment: "Perfect untuk honeymoon." },
    ],
  },
  {
    id: "v3",
    slug: "seminyak-luxe-pool-villa",
    name: "Seminyak Luxe Pool Villa",
    location: "Petitenget, Seminyak",
    area: "Seminyak",
    description:
      "Villa mewah 2 lantai di Petitenget, walking distance ke beach club terkenal. Infinity pool dan interior kontemporer.",
    images: [
      img("photo-1613490493576-7fde63acd811"),
      img("photo-1582719508461-905c673771fd"),
      img("photo-1571003123894-1f0594d2b5d9"),
      img("photo-1512918728675-ed5a9ecdebfd"),
    ],
    pricePerNight: 4750000,
    originalPrice: 5500000,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 212,
    bedrooms: 3,
    guests: 6,
    type: "Luxury Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "kitchen", "gym"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 10 hari sebelum check-in." },
    reviews: [
      { name: "Diana K.", rating: 5, date: "Juni 2026", comment: "Design villanya instagramable banget." },
      { name: "Farhan A.", rating: 5, date: "Mei 2026", comment: "Pelayanan bintang lima." },
    ],
    badges: ["Best Seller"],
  },
  {
    id: "v4",
    slug: "uluwatu-cliff-villa",
    name: "Uluwatu Cliff Villa",
    location: "Pecatu, Uluwatu",
    area: "Uluwatu",
    description:
      "Villa cliff-front dengan panorama Samudera Hindia. Sunset di sini adalah pengalaman yang tidak terlupakan.",
    images: [
      img("photo-1540541338287-41700207dee6"),
      img("photo-1582719508461-905c673771fd"),
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1613490493576-7fde63acd811"),
    ],
    pricePerNight: 6200000,
    rating: 5.0,
    reviewCount: 76,
    bedrooms: 4,
    guests: 8,
    type: "Luxury Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "kitchen", "beach"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 14 hari sebelum check-in." },
    reviews: [{ name: "Kevin T.", rating: 5, date: "Juni 2026", comment: "Best sunset view di seluruh Bali." }],
    badges: ["Premium"],
  },
];

export const testimonials = [
  {
    name: "Alifia Rahmadani",
    role: "Traveler dari Jakarta",
    quote: "Booking villa di Balivio super gampang, harganya paling murah dan customer service-nya cepet banget respon.",
    avatar: img("photo-1494790108377-be9c29b29330", 200, 200),
  },
  {
    name: "Reza Pratama",
    role: "Digital Nomad",
    quote: "Filter villa yang detail bikin gampang cari villa yang wifi-nya kencang buat kerja remote di Canggu.",
    avatar: img("photo-1500648767791-00dcc994a43e", 200, 200),
  },
  {
    name: "Sinta & Family",
    role: "Family Traveler",
    quote: "Kami sekeluarga staycation di Nusa Dua, semuanya sesuai foto. Free cancellation-nya juga membantu.",
    avatar: img("photo-1438761681033-6461ffad8d80", 200, 200),
  },
];

export const mockBookings = [
  {
    id: "BK-2025-0812",
    villaId: "v1",
    checkIn: "2026-08-12",
    checkOut: "2026-08-15",
    guests: 2,
    total: 8400000,
    status: "Upcoming" as const,
  },
  {
    id: "BK-2025-0421",
    villaId: "v3",
    checkIn: "2026-04-21",
    checkOut: "2026-04-24",
    guests: 4,
    total: 14250000,
    status: "Completed" as const,
  },
  {
    id: "BK-2025-0203",
    villaId: "v2",
    checkIn: "2026-02-03",
    checkOut: "2026-02-06",
    guests: 2,
    total: 8550000,
    status: "Completed" as const,
  },
];


export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const getVillaBySlug = (slug: string) => villas.find((v) => v.slug === slug);
export const getVillaById = (id: string) => villas.find((v) => v.id === id);