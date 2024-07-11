import { describe, test, expect } from "bun:test";
import { Pagination } from "./pagination";

describe("Utils pagination", () => {
  test("should create a valid pagination from input", () => {
    const items = [1, 2, 3, 4, 5, 6];
    const perPage = 2;
    const currentPage = 2;
    const data = items;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;
    const pagination = Pagination.from({
      currentPage,
      totalItems,
      perPage,
      data,
    });
    expect(pagination).toEqual({
      page: {
        data: items,
        meta: {
          perPage,
          currentPage,
          totalPages,
          totalItems,
          hasPrev,
          hasNext,
        },
      },
    });
  });
});
