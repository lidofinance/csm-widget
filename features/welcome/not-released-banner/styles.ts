import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--lido-color-primaryContrast);
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
`;

export const NotReleasedBlock = styled(StyledBlock)`
  background: radial-gradient(
      1435.85% 196.07% at 95.46% -44.7%,
      rgba(34, 56, 255, 0.8) 0%,
      rgba(235, 0, 255, 0.4) 100%
    ),
    linear-gradient(102deg, #bae6fd -8.89%, #93c5fd 105.62%);
`;
