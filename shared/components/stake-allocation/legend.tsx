import { FC } from 'react';
import { Dot, LegendSlot, Marker } from './styles';

type LegendSize = 20 | 24;

const DOT_COLORS = {
  success: '--lido-app-ui-color-icons-success',
  active: '--lido-app-ui-color-background-surface-selected',
};

export const LegendDot: FC<{
  color: keyof typeof DOT_COLORS;
  size: LegendSize;
}> = ({ color, size }) => (
  <LegendSlot $size={size} aria-hidden="true">
    <Dot $color={DOT_COLORS[color]} />
  </LegendSlot>
);

export const LegendMarker: FC<{ size: LegendSize }> = ({ size }) => (
  <LegendSlot $size={size} aria-hidden="true">
    <Marker />
  </LegendSlot>
);
