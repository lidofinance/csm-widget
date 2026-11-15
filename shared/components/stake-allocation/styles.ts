import { StatItem } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const LegendSlot = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

export const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(${({ $color }) => $color});
`;

export const Marker = styled.span`
  width: 3px;
  height: 12px;
  background: var(--lido-app-ui-color-border-black);
`;

export const CompactStatItem = styled(StatItem).attrs({ size: 'xsmall' })`
  && {
    flex: 0 0 auto;
    min-width: 0;
  }
`;
