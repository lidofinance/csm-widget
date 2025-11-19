import { FC, PropsWithChildren, useCallback } from 'react';
import { useTable } from './context';

import { ReactComponent as ArrowDown } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from 'assets/icons/arrow-up.svg';
import { SortButtonStyled } from './styles';

type SortButtonProps = {
  column: string;
};

export const SortButton: FC<PropsWithChildren<SortButtonProps>> = ({
  column,
  children,
}) => {
  const { sort, setSort } = useTable();

  const handleClick = useCallback(() => {
    const direction =
      sort?.column === column && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ column, direction });
  }, [sort, column, setSort]);

  const isDown = sort?.column !== column || sort.direction === 'asc';
  const isActive = sort?.column === column;

  return (
    <SortButtonStyled onClick={handleClick} $active={isActive}>
      {children}
      {isDown ? <ArrowDown /> : <ArrowUp />}
    </SortButtonStyled>
  );
};
