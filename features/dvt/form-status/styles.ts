import styled from 'styled-components';
import { Accordion } from '@lidofinance/lido-ui';

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  background: var(--lido-color-backgroundSecondary);

  & > div:first-child {
    padding: 20px;
  }

  & > div + div > div {
    padding: 0 20px 20px 20px;
  }

  p,
  ul,
  ol {
    margin: 0;
  }
`;
