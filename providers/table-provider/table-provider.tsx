import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { TableContext } from './context';
import { Sort, SortFunctions } from './type';
import { applySortCirteria, cropPage } from './utils';

type Props<T = any> = {
  data: T[] | undefined;
  sort?: SortFunctions<T>;
  defaultSort?: Sort<T>;
};

export const TableProvider: FC<PropsWithChildren<Props>> = ({
  children,
  data: rawData = [],
  sort: sortFunctions,
  defaultSort,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, _setPageSize] = useState(10);
  const [sort, setSort] = useState<Sort | undefined>(defaultSort);

  const setPageSize = useCallback((size: number) => {
    setPage(0);
    _setPageSize(size);
  }, []);

  const [data, pages] = useMemo(() => {
    const sortedData = Array.from(rawData);
    if (sort) {
      sortedData.sort(applySortCirteria(sort, sortFunctions));
    }
    return cropPage(sortedData, page, pageSize);
  }, [rawData, sort, page, pageSize, sortFunctions]);

  return (
    <TableContext.Provider
      value={{
        rawData,
        sortFunctions,
        data,
        pageSize,
        pages,
        page,
        sort,
        setPage,
        setPageSize,
        setSort,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
