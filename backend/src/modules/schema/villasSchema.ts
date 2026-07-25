import { z } from 'zod';

export const createVillaSchema = z.object({
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(3).max(255),
  description: z.string().min(10),
  propertyTypeId: z.number().int().positive().optional(),
  areaId: z.number().int().positive().optional(),
  address: z.string().min(5),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerNight: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discountPercent: z.number().int().min(0).max(100).default(0),
  bedrooms: z.number().int().positive().default(1),
  guestsCapacity: z.number().int().positive().default(2),
});

export const updateVillaSchema = createVillaSchema.partial();

export const villaQuerySchema = z.object({
  area_id: z.coerce.number().int().positive().optional(),
  property_type_id: z.coerce.number().int().positive().optional(),
  amenity_ids: z.string().optional(), // comma-separated
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  guests: z.coerce.number().int().positive().optional(),
  bedrooms: z.coerce.number().int().positive().optional(),
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const addImageSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL'),
  sortOrder: z.number().int().min(0).default(0),
});

export const availabilityQuerySchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
});

export const blockDatesSchema = z.object({
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  status: z.enum(['available', 'blocked']),
});

export type CreateVillaDto = z.infer<typeof createVillaSchema>;
export type UpdateVillaDto = z.infer<typeof updateVillaSchema>;
export type VillaQuery = z.infer<typeof villaQuerySchema>;
