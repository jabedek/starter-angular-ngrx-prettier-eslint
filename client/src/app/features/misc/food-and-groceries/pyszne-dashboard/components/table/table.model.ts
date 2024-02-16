export type PaginationConfig = {
  totalItems: number;
  page: number;
  pageSize: number;
};

export type PaginationState = PaginationConfig & {
  pages: number;
  lastPage: number;
};

export type PaginationChange = {
  direction: 'prev' | 'next' | 'first' | 'last' | number;
  fromPage: number;
  toPage: number;
  arrayPart: { start: number; end: number };
};
