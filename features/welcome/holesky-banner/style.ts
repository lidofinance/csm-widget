import { Accordion } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledAccordion = styled(Accordion)`
  --first-color: #bfdbfe;
  --second-color: #ccfbf1;

  background: radial-gradient(
      1435.85% 196.07% at 95.46% -44.7%,
      rgba(34, 56, 255, 0.8) 0%,
      rgba(235, 0, 255, 0.4) 100%
    ),
    linear-gradient(102deg, #bae6fd -8.89%, #93c5fd 105.62%);

  > div + div p {
    margin-bottom: 0.5em;
  }
`;
