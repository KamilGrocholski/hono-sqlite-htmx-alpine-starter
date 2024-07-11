type PaginationInput<T> = {
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: T[];
};

export class Pagination<T> {
  constructor(public page: PaginationInput<T>) {}
}
