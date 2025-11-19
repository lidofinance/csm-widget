import { Sort, SortFunctions } from './type';

export const cropPage = <T>(_data: T[], page: number, pageSize: number) => {
  const start = page * pageSize;
  const end = start + pageSize;
  const data = _data.slice(start, end);
  const pages = Math.ceil(_data.length / pageSize);
  return [data, pages] as const;
};

export const sorting = <T = any>(
  sort: Sort<T>,
  sortFunctions?: SortFunctions<T>,
) => {
  const fn: (i: T) => unknown[] =
    sortFunctions?.[sort.column] ?? ((item: T) => [item[sort.column]]);
  const direction = sort.direction === 'asc' ? 1 : -1;

  return (a: T, b: T) => {
    const valuesA = fn(a);
    const valuesB = fn(b);

    for (const [i, valueA] of valuesA.entries()) {
      const valueB = valuesB[i];

      // undefined always sorts last
      if (valueA === undefined && valueB === undefined) continue;
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      const comparison = compareValues(valueA, valueB);
      if (comparison !== 0) return comparison * direction;
    }

    return 0;
  };
};

const compareValues = (a: unknown, b: unknown): number => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'bigint' && typeof b === 'bigint') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  return Number(a) - Number(b);
};
