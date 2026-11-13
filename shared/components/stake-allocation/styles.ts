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

export const CompactStatItem = styled(StatItem)`
  && {
    flex: 0 0 auto;
    min-width: 0;
  }

  && [class*='StatItem-module_label'] {
    font-size: var(--lido-app-ui-font-size-tooltip);
    line-height: var(--lido-app-ui-line-height-description);
  }

  && [class*='StatItem-module_value'] {
    font-size: var(--lido-app-ui-font-size-label);
    line-height: var(--lido-app-ui-line-height-label);
    font-weight: var(--lido-app-ui-font-weight-semibold);
  }

  && [class*='StatItem-module_subValue'] {
    font-size: var(--lido-app-ui-font-size-tooltip);
    line-height: var(--lido-app-ui-line-height-description);
    color: var(--lido-app-ui-color-text-tertiary);
  }

  && [class*='StatItem-module_titleIcon'] {
    width: 20px;
    height: 20px;
  }

  && [class*='StatItem-module_titleIcon'] > span {
    width: 20px;
    height: 20px;
  }
`;
