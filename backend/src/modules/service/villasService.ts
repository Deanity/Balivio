import { db, villas, villaImages, villaAmenities, villaAvailability, reviews, amenities, areas, propertyTypes } from '@/db';
import { eq, isNull, and, gte, lte, inArray, notInArray, sql, asc, desc, count } from 'drizzle-orm';
import { parsePagination, buildMeta } from '@/utils/paginationUtils';
import type { CreateVillaDto, UpdateVillaDto, VillaQuery } from '@/modules/schema/villasSchema';

// =============================================
// LIST VILLAS (with filters)
// =============================================
export async function listVillas(query: VillaQuery): Promise<Record<string, unknown>> {
  const { page, limit, offset } = parsePagination(query.page, query.limit);

  const conditions = [
    isNull(villas.deletedAt),
    eq(villas.status, 'active'),
  ];

  if (query.area_id) {
    conditions.push(eq(villas.areaId, query.area_id));
  }
  if (query.property_type_id) {
    conditions.push(eq(villas.propertyTypeId, query.property_type_id));
  }
  if (query.min_price) {
    conditions.push(gte(villas.pricePerNight, String(query.min_price)));
  }
  if (query.max_price) {
    conditions.push(lte(villas.pricePerNight, String(query.max_price)));
  }
  if (query.guests) {
    conditions.push(gte(villas.guestsCapacity, query.guests));
  }
  if (query.bedrooms) {
    conditions.push(gte(villas.bedrooms, query.bedrooms));
  }

  // Filter out villas with booked dates if check_in/check_out provided
  if (query.check_in && query.check_out) {
    const bookedVillaIds = db
      .select({ villaId: villaAvailability.villaId })
      .from(villaAvailability)
      .where(
        and(
          eq(villaAvailability.status, 'booked'),
          gte(villaAvailability.date, query.check_in),
          lte(villaAvailability.date, query.check_out)
        )
      );
    conditions.push(sql`${villas.id} NOT IN (${bookedVillaIds})`);
  }

  // Filter by amenity_ids
  if (query.amenity_ids) {
    const amenityIdList = query.amenity_ids.split(',').map(Number).filter(Boolean);
    if (amenityIdList.length > 0) {
      const villaIdsWithAmenities = db
        .select({ villaId: villaAmenities.villaId })
        .from(villaAmenities)
        .where(inArray(villaAmenities.amenityId, amenityIdList))
        .groupBy(villaAmenities.villaId)
        .having(sql`count(distinct ${villaAmenities.amenityId}) = ${amenityIdList.length}`);
      conditions.push(sql`${villas.id} IN (${villaIdsWithAmenities})`);
    }
  }

  const whereConditions = and(...conditions);

  // Sort order
  let orderBy;
  switch (query.sort) {
    case 'price_asc':
      orderBy = asc(villas.pricePerNight);
      break;
    case 'price_desc':
      orderBy = desc(villas.pricePerNight);
      break;
    case 'newest':
      orderBy = desc(villas.createdAt);
      break;
    default:
      orderBy = desc(villas.createdAt);
  }

  const [villaList, totalResult] = await Promise.all([
    db
      .select({
        id: villas.id,
        slug: villas.slug,
        name: villas.name,
        pricePerNight: villas.pricePerNight,
        originalPrice: villas.originalPrice,
        discountPercent: villas.discountPercent,
        bedrooms: villas.bedrooms,
        guestsCapacity: villas.guestsCapacity,
        status: villas.status,
        createdAt: villas.createdAt,
        areaName: areas.name,
        propertyTypeName: propertyTypes.name,
      })
      .from(villas)
      .leftJoin(areas, eq(villas.areaId, areas.id))
      .leftJoin(propertyTypes, eq(villas.propertyTypeId, propertyTypes.id))
      .where(whereConditions)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(villas).where(whereConditions),
  ]);

  // Fetch cover image for each villa
  const villaIds = villaList.map((v) => v.id);
  const images =
    villaIds.length > 0
      ? await db
          .select({ villaId: villaImages.villaId, imageUrl: villaImages.imageUrl })
          .from(villaImages)
          .where(and(inArray(villaImages.villaId, villaIds), eq(villaImages.sortOrder, 0)))
      : [];

  const imageMap = new Map(images.map((img) => [img.villaId, img.imageUrl]));
  const enriched = villaList.map((v) => ({
    ...v,
    coverImage: imageMap.get(v.id) ?? null,
  }));

  const rawCount = totalResult[0]?.count;
  const total = typeof rawCount === 'number' ? rawCount : parseInt(String(rawCount ?? 0), 10);

  return {
    data: enriched,
    meta: buildMeta(total, page, limit),
  };
}

// =============================================
// GET VILLA BY SLUG
// =============================================
export async function getVillaBySlug(slug: string): Promise<Record<string, unknown>> {
  const [villa] = await db
    .select()
    .from(villas)
    .where(and(eq(villas.slug, slug), isNull(villas.deletedAt)))
    .limit(1);

  if (!villa) {
    const err = new Error('Villa not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  // Fetch related data in parallel
  const [images, amenityList, policy] = await Promise.all([
    db.select().from(villaImages).where(eq(villaImages.villaId, villa.id)).orderBy(asc(villaImages.sortOrder)),
    db
      .select({ id: amenities.id, key: amenities.key, label: amenities.label, iconName: amenities.iconName, category: amenities.category })
      .from(villaAmenities)
      .innerJoin(amenities, eq(villaAmenities.amenityId, amenities.id))
      .where(eq(villaAmenities.villaId, villa.id)),
    db.query.villaPolicies?.findFirst({ where: (p, { eq }) => eq(p.villaId, villa.id) }),
  ]);

  return { ...villa, images, amenities: amenityList, policy: policy ?? null };
}

// =============================================
// GET AVAILABILITY CALENDAR
// =============================================
export async function getAvailability(
  villaId: string,
  startDate: string,
  endDate: string
): Promise<unknown[]> {
  return db
    .select()
    .from(villaAvailability)
    .where(
      and(
        eq(villaAvailability.villaId, villaId),
        gte(villaAvailability.date, startDate),
        lte(villaAvailability.date, endDate)
      )
    )
    .orderBy(asc(villaAvailability.date));
}

// =============================================
// CREATE VILLA
// =============================================
export async function createVilla(
  dto: CreateVillaDto,
  hostId: string
): Promise<Record<string, unknown>> {
  const [villa] = await db
    .insert(villas)
    .values({
      ...dto,
      pricePerNight: String(dto.pricePerNight),
      originalPrice: dto.originalPrice ? String(dto.originalPrice) : null,
      hostId,
    })
    .returning();

  if (!villa) throw new Error('Failed to create villa');
  return villa as Record<string, unknown>;
}

// =============================================
// UPDATE VILLA
// =============================================
export async function updateVilla(
  villaId: string,
  dto: UpdateVillaDto,
  hostId: string
): Promise<Record<string, unknown>> {
  const [existing] = await db
    .select({ hostId: villas.hostId })
    .from(villas)
    .where(and(eq(villas.id, villaId), isNull(villas.deletedAt)))
    .limit(1);

  if (!existing) {
    const err = new Error('Villa not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (existing.hostId !== hostId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  const updateData: Record<string, unknown> = { ...dto };
  if (dto.pricePerNight !== undefined) updateData.pricePerNight = String(dto.pricePerNight);
  if (dto.originalPrice !== undefined) updateData.originalPrice = String(dto.originalPrice);

  const [updated] = await db
    .update(villas)
    .set(updateData as Parameters<typeof db.update>[0] extends (table: typeof villas) => { set: (values: infer V) => unknown } ? V : never)
    .where(eq(villas.id, villaId))
    .returning();

  return updated as Record<string, unknown>;
}

// =============================================
// SOFT DELETE VILLA
// =============================================
export async function deleteVilla(villaId: string, hostId: string): Promise<void> {
  const [existing] = await db
    .select({ hostId: villas.hostId })
    .from(villas)
    .where(and(eq(villas.id, villaId), isNull(villas.deletedAt)))
    .limit(1);

  if (!existing) {
    const err = new Error('Villa not found') as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (existing.hostId !== hostId) {
    const err = new Error('Forbidden') as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }

  await db
    .update(villas)
    .set({ deletedAt: new Date() })
    .where(eq(villas.id, villaId));
}

// =============================================
// ADD IMAGE
// =============================================
export async function addVillaImage(
  villaId: string,
  imageUrl: string,
  sortOrder: number
): Promise<Record<string, unknown>> {
  const [img] = await db
    .insert(villaImages)
    .values({ villaId, imageUrl, sortOrder })
    .returning();
  return img as Record<string, unknown>;
}

// =============================================
// DELETE IMAGE
// =============================================
export async function deleteVillaImage(imageId: string): Promise<void> {
  await db.delete(villaImages).where(eq(villaImages.id, imageId));
}

// =============================================
// BLOCK / UNBLOCK DATES
// =============================================
export async function updateAvailability(
  villaId: string,
  dates: string[],
  status: 'available' | 'blocked'
): Promise<void> {
  for (const date of dates) {
    await db
      .insert(villaAvailability)
      .values({ villaId, date, status })
      .onConflictDoUpdate({
        target: [villaAvailability.villaId, villaAvailability.date],
        set: { status },
      });
  }
}

// =============================================
// GET REVIEWS FOR A VILLA
// =============================================
export async function getVillaReviews(
  villaId: string,
  page: number,
  limit: number
): Promise<Record<string, unknown>> {
  const { offset } = parsePagination(page, limit);

  const [reviewList, totalResult] = await Promise.all([
    db
      .select()
      .from(reviews)
      .where(and(eq(reviews.villaId, villaId), isNull(reviews.deletedAt)))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(reviews.createdAt)),
    db.select({ count: count() }).from(reviews).where(and(eq(reviews.villaId, villaId), isNull(reviews.deletedAt))),
  ]);

  return {
    data: reviewList,
    meta: buildMeta(totalResult[0]?.count ?? 0, page, limit),
  };
}
