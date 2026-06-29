import { Input } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledInput = styled(Input).attrs({ spellCheck: false })`
  > span:has(:disabled) {
    background: var(--lido-color-accentControlBg);
  }
`;
