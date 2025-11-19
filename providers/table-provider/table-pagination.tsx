import { FC } from 'react';
import { useTable } from './context';
import { PaginationStyled } from './styles';

export const TablePagination: FC = () => {
  const { page, pages, setPage } = useTable();

  if (pages <= 1) return null;

  return (
    <PaginationStyled
      pagesCount={pages}
      activePage={page + 1}
      onItemClick={(page) => setPage(page - 1)}
      siblingCount={1}
    />
  );
};
