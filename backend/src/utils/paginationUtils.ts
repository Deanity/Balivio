export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Parse and validate pagination query params.
 * Returns safe page/limit/offset values.
 */
export function parsePagination(
  rawPage: unknown,
  rawLimit: unknown
): PaginationParams {
  const page = Math.max(1, parseInt(String(rawPage ?? '1'), 10) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(String(rawLimit ?? DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Build meta object for paginated responses.
 */
export function buildMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
