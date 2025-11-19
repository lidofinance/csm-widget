import { FC, PropsWithChildren, useMemo, useState } from 'react';
import { TableContext } from './context';
import { Sort, SortFunctions } from './type';
import { cropPage, sorting } from './utils';

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
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<Sort | undefined>(defaultSort);

  const [data, pages] = useMemo(() => {
    const sortedData = Array.from(rawData);
    if (sort) {
      sortedData.sort(sorting(sort, sortFunctions));
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
