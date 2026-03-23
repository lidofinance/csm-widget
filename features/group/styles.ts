import { Divider } from '@lidofinance/lido-ui';
import { Block } from 'shared/components';
import styled from 'styled-components';

export const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spaceMap.xl}px;

  > :first-child {
    grid-column: 1 / -1;
  }

  &:not(:has(> :nth-child(3))) {
    grid-template-columns: 1fr;
    max-width: var(--layout-base-width);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: 1fr;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  min-width: 0;
`;

export const CardSubheader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;

export const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;

export const KeyLimitText = styled.p`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  text-align: center;
`;

export const DividerStyled = styled(Divider).attrs({ type: 'vertical' })`
  opacity: 0.3;
`;

export const GroupBlockStyled = styled(Block)`
  outline: 1px solid var(--lido-color-border);
`;
