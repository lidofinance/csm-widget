import { Divider } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const HeaderStyle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.md}px;
  font-weight: 700;
  line-height: 28px;
`;

export const AddressesStyle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
`;

export const AddressLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const PendingIconStyle = styled.span`
  display: inline-flex;
  color: var(--lido-color-warning);

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const VerticalDivider = styled(Divider).attrs({ type: 'vertical' })`
  height: 16px;
  opacity: 0.3;
`;

export const KeysRowStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const BondRowStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spaceMap.lg}px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;

export const SuggestionStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid
    color-mix(in srgb, var(--lido-color-primary) 20%, transparent);
  background: color-mix(in srgb, var(--lido-color-primary) 5%, transparent);
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 20px;
`;

export const SuggestionText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const SuggestionButton = styled.button`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: 28px;
  border: 0;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  background: color-mix(in srgb, var(--lido-color-primary) 10%, transparent);
  color: var(--lido-color-primary);
  font: inherit;
  white-space: nowrap;
`;
