import { ButtonIcon, Close } from '@lidofinance/lido-ui';
import { PubkeyContainerStyle } from 'shared/components/address/styles';
import styled from 'styled-components';

export const TableContainer = styled.div<{
  $equal?: boolean;
  $short?: boolean;
}>`
  background: var(--lido-color-accentControlBg);
  padding: ${({ theme }) => theme.spaceMap.md}px;
  position: relative;
  overflow: scroll;
  height: 150px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  --columns: ${({ $equal, $short }) =>
    $short
      ? $equal
        ? '1fr 1fr 1fr'
        : '3fr 2fr 2fr'
      : $equal
        ? '1fr 1fr 1fr 1fr'
        : '3fr 2fr 2fr 2fr'};
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spaceMap.xs}px;
  border-bottom: 1px solid #d1d5db;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  justify-content: space-between;
  align-items: center;
`;

export const HeaderCell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;

  &:first-child {
    justify-content: flex-start;
  }
`;

export const DataCell = styled.div<{ $error?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ $error }) =>
    $error ? 'var(--lido-color-error)' : 'var(--lido-color-text)'};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;

  &:first-child {
    justify-content: flex-start;
  }

  ${PubkeyContainerStyle} {
    font-size: inherit;
  }
`;

export const DeleteButton = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xs',
})`
  color: var(--lido-color-textSecondary);
  flex-shrink: 0;
  padding: 8px;
  margin: -4px;
`;

export const DataError = styled.div`
  grid-column: 1 / -1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;
