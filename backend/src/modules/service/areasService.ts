import { db, areas, propertyTypes, amenities } from '../../db';

export async function listAreas(): Promise<unknown[]> {
  return db.select().from(areas).orderBy(areas.name);
}

export async function listPropertyTypes(): Promise<unknown[]> {
  return db.select().from(propertyTypes).orderBy(propertyTypes.name);
}

export async function listAmenities(): Promise<unknown[]> {
  return db.select().from(amenities).orderBy(amenities.category, amenities.label);
}
