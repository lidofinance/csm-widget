import { Input, ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledInput = styled(Input)`
  > span:has(:disabled) {
    background-color: ${({ theme }) =>
      theme.name === ThemeName.light ? '#F6F8FA' : '#252a2e'};
  }
`;
