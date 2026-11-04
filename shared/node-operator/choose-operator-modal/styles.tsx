import { IconSpinner } from '@lidofinance/lido-app-ui';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

export const ContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const LoadingStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

export const SpinnerStyle = styled(IconSpinner)`
  width: 40px;
  height: 40px;
  color: var(--lido-app-ui-color-icons-secondary);
  animation: ${spin} 0.9s linear infinite;
`;
