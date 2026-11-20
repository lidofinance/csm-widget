import { CSSProperties, FC } from 'react';
import s from './styles.module.css';

type LegendSize = 20 | 24;

const DOT_COLORS = {
  success: '--lido-app-ui-color-icons-success',
  active: '--lido-app-ui-color-background-surface-selected',
};

export const LegendDot: FC<{
  color: keyof typeof DOT_COLORS;
  size: LegendSize;
}> = ({ color, size }) => (
  <span
    className={s.legendSlot}
    style={{ '--legend-size': `${size}px` } as CSSProperties}
    aria-hidden="true"
  >
    <span
      className={s.dot}
      style={{ '--dot-color': `var(${DOT_COLORS[color]})` } as CSSProperties}
    />
  </span>
);

export const LegendMarker: FC<{ size: LegendSize }> = ({ size }) => (
  <span
    className={s.legendSlot}
    style={{ '--legend-size': `${size}px` } as CSSProperties}
    aria-hidden="true"
  >
    <span className={s.marker} />
  </span>
);
