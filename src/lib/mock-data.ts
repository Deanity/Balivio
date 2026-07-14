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
  {
    id: "v5",
    slug: "canggu-surf-house",
    name: "Canggu Surf House",
    location: "Batu Bolong, Canggu",
    area: "Canggu",
    description:
      "Surf house minimalis untuk surfer & digital nomad. Dekat ke Batu Bolong Beach dan cafe favorit.",
    images: [
      img("photo-1512918728675-ed5a9ecdebfd"),
      img("photo-1582268611958-ebfd161df9d8"),
      img("photo-1566073771259-6a8506099945"),
    ],
    pricePerNight: 1650000,
    originalPrice: 1950000,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 156,
    bedrooms: 1,
    guests: 2,
    type: "Boutique Villa",
    amenities: ["wifi", "ac", "kitchen", "parking"],
    policies: { checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation hingga 3 hari sebelum check-in." },
    reviews: [{ name: "Leo M.", rating: 5, date: "Mei 2026", comment: "Cozy, wifi kencang, cocok WFB." }],
  },
  {
    id: "v6",
    slug: "ubud-rice-view-villa",
    name: "Ubud Rice View Villa",
    location: "Payangan, Ubud",
    area: "Ubud",
    description:
      "Menyatu dengan alam Payangan, villa ini menyuguhkan pool yang menghadap sawah dan lembah hijau.",
    images: [
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1540541338287-41700207dee6"),
      img("photo-1566073771259-6a8506099945"),
    ],
    pricePerNight: 2850000,
    rating: 4.8,
    reviewCount: 112,
    bedrooms: 2,
    guests: 4,
    type: "Private Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "kitchen"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 7 hari sebelum check-in." },
    reviews: [{ name: "Nadia R.", rating: 5, date: "April 2026", comment: "Suasana sangat tenang, recommended." }],
  },
  {
    id: "v7",
    slug: "seminyak-family-villa",
    name: "Seminyak Family Villa",
    location: "Kerobokan, Seminyak",
    area: "Seminyak",
    description: "Villa luas dengan 4 kamar tidur, sempurna untuk liburan keluarga besar dengan private pool.",
    images: [
      img("photo-1582719508461-905c673771fd"),
      img("photo-1613490493576-7fde63acd811"),
      img("photo-1571003123894-1f0594d2b5d9"),
    ],
    pricePerNight: 5400000,
    originalPrice: 6200000,
    discountPercent: 13,
    rating: 4.8,
    reviewCount: 89,
    bedrooms: 4,
    guests: 8,
    type: "Family Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "kitchen"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 7 hari sebelum check-in." },
    reviews: [{ name: "Ibu Ratna", rating: 5, date: "Juni 2026", comment: "Anak-anak seneng banget, kolamnya luas." }],
  },
  {
    id: "v8",
    slug: "nusa-dua-beachfront-villa",
    name: "Nusa Dua Beachfront Villa",
    location: "Benoa, Nusa Dua",
    area: "Nusa Dua",
    description: "Villa tepi pantai dengan akses langsung ke pantai Benoa. Cocok untuk keluarga dan honeymoon.",
    images: [
      img("photo-1571003123894-1f0594d2b5d9"),
      img("photo-1582719508461-905c673771fd"),
      img("photo-1540541338287-41700207dee6"),
    ],
    pricePerNight: 3900000,
    rating: 4.7,
    reviewCount: 143,
    bedrooms: 3,
    guests: 6,
    type: "Family Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "beach"],
    policies: { checkIn: "15:00", checkOut: "12:00", cancellation: "Free cancellation hingga 5 hari sebelum check-in." },
    reviews: [{ name: "Rio H.", rating: 5, date: "Mei 2026", comment: "Bangun tidur langsung liat laut. Amazing." }],
  },
  {
    id: "v9",
    slug: "sanur-sunrise-villa",
    name: "Sanur Sunrise Villa",
    location: "Sanur Kaja, Sanur",
    area: "Sanur",
    description: "Villa tenang di Sanur, cocok untuk liburan keluarga. Nikmati sunrise di pantai Sanur.",
    images: [
      img("photo-1573790387438-4da905039392"),
      img("photo-1582719508461-905c673771fd"),
      img("photo-1512918728675-ed5a9ecdebfd"),
    ],
    pricePerNight: 1850000,
    rating: 4.6,
    reviewCount: 67,
    bedrooms: 2,
    guests: 4,
    type: "Private Villa",
    amenities: ["pool", "wifi", "ac", "kitchen", "parking"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 5 hari sebelum check-in." },
    reviews: [{ name: "Wira P.", rating: 5, date: "April 2026", comment: "Villa cozy, host baik banget." }],
  },
  {
    id: "v10",
    slug: "uluwatu-clifftop-suites",
    name: "Uluwatu Clifftop Suites",
    location: "Bingin, Uluwatu",
    area: "Uluwatu",
    description: "Suites modern di tebing Bingin dengan pool infinity dan view Samudera Hindia yang epic.",
    images: [
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1540541338287-41700207dee6"),
      img("photo-1571003123894-1f0594d2b5d9"),
    ],
    pricePerNight: 4200000,
    originalPrice: 4900000,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 98,
    bedrooms: 2,
    guests: 4,
    type: "Luxury Villa",
    amenities: ["pool", "wifi", "ac", "breakfast", "parking", "beach"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 7 hari sebelum check-in." },
    reviews: [{ name: "Elva C.", rating: 5, date: "Juni 2026", comment: "Design keren, staff professional." }],
  },
  {
    id: "v11",
    slug: "canggu-tropical-hideaway",
    name: "Canggu Tropical Hideaway",
    location: "Pererenan, Canggu",
    area: "Canggu",
    description: "Hideaway tropis di Pererenan, area yang lebih tenang dari Berawa tapi tetap dekat ke pantai.",
    images: [
      img("photo-1582268611958-ebfd161df9d8"),
      img("photo-1512918728675-ed5a9ecdebfd"),
      img("photo-1613490493576-7fde63acd811"),
    ],
    pricePerNight: 2200000,
    rating: 4.8,
    reviewCount: 74,
    bedrooms: 2,
    guests: 4,
    type: "Private Villa",
    amenities: ["pool", "wifi", "ac", "kitchen", "parking"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 5 hari sebelum check-in." },
    reviews: [{ name: "Tania Y.", rating: 5, date: "Mei 2026", comment: "Vibe-nya cozy dan modern." }],
  },
  {
    id: "v12",
    slug: "ubud-eco-bamboo-villa",
    name: "Ubud Eco Bamboo Villa",
    location: "Sayan, Ubud",
    area: "Ubud",
    description: "Villa dengan arsitektur bambu eco-friendly di Sayan. Pengalaman menginap yang unik dan berkelanjutan.",
    images: [
      img("photo-1566073771259-6a8506099945"),
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1540541338287-41700207dee6"),
    ],
    pricePerNight: 3600000,
    originalPrice: 4200000,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 58,
    bedrooms: 2,
    guests: 4,
    type: "Boutique Villa",
    amenities: ["pool", "wifi", "breakfast", "kitchen"],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation hingga 7 hari sebelum check-in." },
    reviews: [{ name: "Bimo A.", rating: 5, date: "April 2026", comment: "Konsep bambunya unik banget, healing max." }],
    badges: ["Eco"],
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
    villaId: "v6",
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