import { Chip as BaseChip } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const Chip = styled(BaseChip).attrs({ variant: 'gray' })`
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  vertical-align: middle;
`;
