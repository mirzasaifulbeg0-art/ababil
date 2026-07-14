/**
 * Shared application types. As modules are built we'll add DTOs and view-models
 * here. For now it holds small helpers used across the UI.
 */

/** A single item in the primary navigation. */
export interface NavItem {
  label: string;
  href: string;
}

/** Standard shape for API JSON responses. */
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Generic paginated result wrapper. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
