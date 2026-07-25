export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: unknown[] | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}
