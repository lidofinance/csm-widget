import { Accordion } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

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

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  background: var(--lido-color-backgroundSecondary);
  /* padding: 20px; */

  & > div:first-child {
    padding: 20px;
  }

  & > div + div > div {
    padding: 0 20px 20px 20px;
  }
`;
