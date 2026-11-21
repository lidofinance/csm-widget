import { FC, PropsWithChildren } from 'react';
import s from './styles.module.css';

type LegendSize = 20 | 24;
type DotColor = 'success' | 'active';

const LegendSlot: FC<PropsWithChildren<{ size: LegendSize }>> = ({
  size,
  children,
}) => (
  <span className={s.legendSlot} data-size={size} aria-hidden="true">
    {children}
  </span>
);

export const LegendDot: FC<{
  color: DotColor;
  size: LegendSize;
}> = ({ color, size }) => (
  <LegendSlot size={size}>
    <span className={s.dot} data-color={color} />
  </LegendSlot>
);

export const LegendMarker: FC<{ size: LegendSize }> = ({ size }) => (
  <LegendSlot size={size}>
    <span className={s.marker} />
  </LegendSlot>
);
