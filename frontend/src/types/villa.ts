export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Villa {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  area: 'Canggu' | 'Ubud' | 'Seminyak' | 'Uluwatu' | 'Sanur' | 'Nusa Dua';
  pricePerNight: number;
  originalPricePerNight?: number;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  images: string[];
  isPromo?: boolean;
  isBestSeller?: boolean;
  isPremium?: boolean;
  description: string;
  amenities: string[];
  rules: string[];
  checkInTime: string;
  checkOutTime: string;
  latitude?: number;
  longitude?: number;
  hostName: string;
  hostAvatar: string;
  hostResponseTime: string;
  reviewsList?: Review[];
}

export interface VillaFilter {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  bedrooms?: number;
  amenities?: string[];
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';
}
