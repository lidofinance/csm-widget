import styled from 'styled-components';
import { StackStyle } from '../../components/stack/style';

export const AlertStyled = styled(StackStyle).attrs({
  $direction: 'column',
})`
  gap: 2px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: var(--lido-color-foreground);
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;
