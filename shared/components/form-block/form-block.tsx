import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const FormBlock = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;
