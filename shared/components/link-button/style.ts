import { Button, Link } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px; // @style
  }
`;

export const StyledLink = styled(Link)`
  flex: 1 1 100%;
`;
