export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

export type PaginationInput = {
  page?: number | string;
  pageSize?: number | string;
};

const toPositiveInteger = (value: number | string | undefined, fallback: number) => {
  const numberValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isInteger(numberValue) || !numberValue || numberValue < 1) {
    return fallback;
  }

  return numberValue;
};

export const getPagination = ({ page, pageSize }: PaginationInput = {}) => {
  const currentPage = toPositiveInteger(page, 1);
  const take = Math.min(toPositiveInteger(pageSize, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

  return {
    page: currentPage,
    pageSize: take,
    skip: (currentPage - 1) * take,
    take,
  };
};
