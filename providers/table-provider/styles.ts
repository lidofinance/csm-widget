import { Button, Pagination } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const PaginationStyled = styled(Pagination)`
  align-self: center;
`;

export const SortButtonStyled = styled(Button).attrs({
  variant: 'ghost',
  color: 'secondary',
  size: 'xxs',
})<{ $active?: boolean }>`
  margin-inline: -6px;
  padding: 6px 2px 6px 6px;
  min-width: auto;

  > span {
    display: flex;
    gap: ${({ theme }) => theme.spaceMap.xs}px;
    align-items: center;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-block: -2px;

    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    color: ${({ theme, $active }) =>
      $active ? theme.colors['primary'] : theme.colors['secondary']};
  }
`;
