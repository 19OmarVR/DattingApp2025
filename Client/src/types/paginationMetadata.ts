export type PaginationMetadata = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type PaginationResult<T> = {
  items: T[];
  metadata: PaginationMetadata;
}
