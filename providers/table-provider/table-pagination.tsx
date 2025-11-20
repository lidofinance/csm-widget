import { Option } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useTable } from './context';
import { PaginationStyled, SelectStyle, Wrapper } from './styles';

export const TablePagination: FC = () => {
  const { page, pages, pageSize, setPage, setPageSize } = useTable();

  return (
    <Wrapper>
      <PaginationStyled
        pagesCount={pages}
        activePage={page + 1}
        onItemClick={(page) => setPage(page - 1)}
        siblingCount={1}
      />
      <SelectStyle
        arrow="small"
        onChange={(size) => setPageSize(Number(size))}
        value={pageSize}
        variant="small"
      >
        <Option value={10}>10 rows</Option>
        <Option value={20}>20 rows</Option>
        <Option value={50}>50 rows</Option>
        <Option value={100}>100 rows</Option>
      </SelectStyle>
    </Wrapper>
  );
};
