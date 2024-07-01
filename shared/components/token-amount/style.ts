import styled from 'styled-components';

export const TokenAmountStyle = styled.span`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;

  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 1.5em;
  font-weight: 700;

  & > svg {
    flex-shrink: 0;
  }
`;

export const SymbolStyle = styled.span`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
`;
