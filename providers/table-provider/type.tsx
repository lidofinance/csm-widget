export type SortCriteria<T> = (
  i: T,
) => (number | bigint | string | undefined)[];
export type SortFunctions<T> = Partial<Record<keyof T, SortCriteria<T>>>;

export type Sort<T = any> = {
  column: keyof T;
  direction: 'asc' | 'desc';
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
