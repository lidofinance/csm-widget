import { Sort, SortCriteria, SortDirection, SortFunctions } from './type';

export const cropPage = <T>(_data: T[], page: number, pageSize: number) => {
  const start = page * pageSize;
  const end = start + pageSize;
  const data = _data.slice(start, end);
  const pages = Math.ceil(_data.length / pageSize);
  return [data, pages] as const;
};

export const applySortCirteria = <T = any>(
  sort: Sort<T>,
  sortFunctions?: SortFunctions<T>,
) =>
  sorting(
    sortFunctions?.[sort.column] ?? ((item: T) => [item[sort.column]]),
    sort.direction,
  );

export const sorting = <T = any>(
  fn: SortCriteria<T, unknown>,
  direction: SortDirection = 'asc',
) => {
  const modifier = direction === 'asc' ? 1 : -1;

  return (a: T, b: T) => {
    const valuesA = fn(a);
    const valuesB = fn(b);

    for (const [i, valueA] of valuesA.entries()) {
      const valueB = valuesB[i];

      const comparison = compareValues(valueA, valueB);
      if (comparison !== 0) return comparison * modifier;
    }

    return 0;
  };
};

const compareValues = (a: unknown, b: unknown): number => {
  if (a === undefined && b === undefined) 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'bigint' && typeof b === 'bigint') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  return Number(a) - Number(b);
};
