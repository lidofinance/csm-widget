import { Button, Pagination, Select } from '@lidofinance/lido-ui';
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

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  justify-items: end;

  & > *:first-child {
    grid-column: 2 / 3;
    justify-self: center;
  }
`;

export const SelectStyle = styled(Select)`
  width: fit-content;

  & > span {
    max-height: 32px;
    padding: 5px 12px;
    min-width: 112px;
    width: 120px;
    border-radius: 6px;
  }

  div + span {
    padding-left: 8px;
  }
`;
