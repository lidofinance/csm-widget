import { Pagination } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useTable } from './context';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const TablePagination: FC = () => {
  const { page, pages, pageSize, setPage, setPageSize } = useTable();

  if (pages < 1) {
    return null;
  }

  return (
    <Pagination
      page={page + 1}
      pageCount={pages}
      onPageChange={(next) => setPage(next - 1)}
      pageSize={pageSize}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      onPageSizeChange={setPageSize}
    />
  );
};
