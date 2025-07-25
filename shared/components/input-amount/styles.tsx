import { Input } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledInput = styled(Input)`
  > span:has(:disabled) {
    background: var(--lido-color-accentControlBg);
  }
`;
