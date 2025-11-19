export type SortCriteria<T, R = number | bigint | string | undefined> = (
  i: T,
) => R[];

export type SortFunctions<T> = Partial<Record<keyof T, SortCriteria<T>>>;

export type SortDirection = 'asc' | 'desc';

export type Sort<T = any> = {
  column: keyof T;
  direction: SortDirection;
};

export type TableContextValue<T> = {
  rawData: T[];
  sortFunctions?: SortFunctions<T>;
  data: T[];
  pageSize: number;
  pages: number;
  page: number;
  sort: Sort | undefined;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (sort: Sort | undefined) => void;
};
