import { Theme } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled from 'styled-components';

// TODO: check similar component in feature/ics
export const CategoryItemsWrapper = styled(StackStyle).attrs({
  $direction: 'column',
})<{ $offset?: keyof Theme['spaceMap'] }>`
  position: relative;
  padding-left: ${({ theme, $offset = 'xl' }) => theme.spaceMap[$offset]}px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 2px;
    height: 100%;
    left: 0px;
    background: var(--lido-color-border);
    border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  }
`;
