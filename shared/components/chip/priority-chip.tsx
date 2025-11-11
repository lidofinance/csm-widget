import { Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { StyledPriorityChip } from './styles';

export const PriorityChip: FC = () => (
  <Tooltip placement="top" title="In priority queue">
    <StyledPriorityChip>P</StyledPriorityChip>
  </Tooltip>
);
