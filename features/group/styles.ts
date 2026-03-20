import { Divider } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const GroupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spaceMap.xl}px;

  &:has(> :only-child) {
    grid-template-columns: 1fr;
  }

  ${({ theme }) => theme.mediaQueries.md} {
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
