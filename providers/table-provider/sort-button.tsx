import { FC, PropsWithChildren, useCallback } from 'react';
import { useTable } from './context';

import { ReactComponent as ArrowDown } from 'assets/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from 'assets/icons/arrow-up.svg';
import { SortButtonStyled } from './styles';
import { ArrowBottom, ArrowTop } from '@lidofinance/lido-ui';

type VariantProps = {
  variant?: 'arrow' | 'chevron';
};

type SortButtonProps = {
  column: string;
} & VariantProps;

export const SortButton: FC<PropsWithChildren<SortButtonProps>> = ({
  column,
  children,
  variant,
}) => {
  const { sort, setSort } = useTable();

  const handleClick = useCallback(() => {
    const direction =
      sort?.column === column && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ column, direction });
  }, [sort, column, setSort]);

  const isAsc = sort?.column !== column || sort.direction === 'asc';
  const isActive = sort?.column === column;

  return (
    <SortButtonStyled onClick={handleClick} $active={isActive}>
      {children}
      {isAsc ? <IconAsc variant={variant} /> : <IconDesc variant={variant} />}
    </SortButtonStyled>
  );
};

const IconAsc: FC<VariantProps> = ({ variant = 'chevron' }) =>
  variant === 'arrow' ? <ArrowDown /> : <ArrowBottom />;

const IconDesc: FC<VariantProps> = ({ variant = 'chevron' }) =>
  variant === 'arrow' ? <ArrowUp /> : <ArrowTop />;
