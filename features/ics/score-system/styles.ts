import { Theme } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import { AccordionNavigatable } from 'shared/components/accordion-navigatable';
import styled from 'styled-components';

export const ScoreAccordionstyle = styled(AccordionNavigatable).attrs({
  border: false,
})`
  margin: 0;
  && > button {
    padding: 0;
    min-height: 24px;
  }
  && > div > div > div {
    padding: 4px 0 0;
  }

  p,
  ul,
  ol {
    margin: 0;
  }
`;

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
