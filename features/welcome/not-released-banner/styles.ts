import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--lido-color-primaryContrast);
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
`;

export const NotReleasedBlock = styled(StyledBlock)`
  background: linear-gradient(180deg, #5b4479 0%, #744ea4 100%);
`;
