import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const Row = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'lg',
})`
  color: var(--lido-color-text);
  background: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  padding: 20px;
`;

export const RowTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
`;

export const RowHeader = styled(StackStyle)`
  justify-content: space-between;
  align-items: center;
`;

export const RowBody = styled(StackStyle).attrs({ $gap: 'xl' })``;
