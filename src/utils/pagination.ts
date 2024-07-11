type Page<T> = {
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
  constructor(public page: Page<T>) {}

  static from<D>({
    currentPage,
    totalItems,
    perPage,
    data,
  }: {
    currentPage: number;
    totalItems: number;
    perPage: number;
    data: D[];
  }): Pagination<D> {
    const totalPages = Math.ceil(totalItems / perPage);
    return new Pagination<D>({
      meta: {
        totalPages,
        totalItems,
        currentPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        perPage,
      },
      data,
    });
  }
}
