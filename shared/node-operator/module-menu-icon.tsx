import { CSSProperties, FC, ReactNode } from 'react';
import csm2Base from 'assets/icons/module-menu/csm2-base.svg';
import csm2V0 from 'assets/icons/module-menu/csm2-v0.svg';
import csm2V1 from 'assets/icons/module-menu/csm2-v1.svg';
import csm2V2 from 'assets/icons/module-menu/csm2-v2.svg';
import csm2V3 from 'assets/icons/module-menu/csm2-v3.svg';
import csm2V4 from 'assets/icons/module-menu/csm2-v4.svg';
import csm2V5 from 'assets/icons/module-menu/csm2-v5.svg';
import csm2V6 from 'assets/icons/module-menu/csm2-v6.svg';
import curated2Group from 'assets/icons/module-menu/curated2-group.svg';

import s from './module-menu-icon.module.css';

export type ModuleMenuIconProps = {
  variant: 'curated2' | 'csm2';
  size?: 60 | 40;
};

const Layer: FC<{
  src?: string;
  inset: string;
  blend?: boolean;
  children?: ReactNode;
}> = ({ src, inset, blend, children }) => (
  <span
    className={s.layer}
    data-blend={blend || undefined}
    style={{ '--layer-inset': inset } as CSSProperties}
  >
    {src ? <img src={src} alt="" /> : children}
  </span>
);

const CSM2_VECTORS = [
  { src: csm2V0, inset: '29.72% 33.54% 32.3% 41.4%' },
  { src: csm2V1, inset: '19.55% 53.01% 41.83% 23.75%' },
  { src: csm2V2, inset: '13.75% 43.58% 71.13% 28.35%' },
  { src: csm2V3, inset: '36.79% 24.41% 32.98% 50.13%' },
  { src: csm2V4, inset: '23.54% 25.07% 52.85% 44.73%' },
  { src: csm2V5, inset: '44.42% 48.57% 49.77% 41.4%', blend: true },
  { src: csm2V6, inset: '27.29% 52.86% 48.63% 31.19%' },
];

export const ModuleMenuIcon: FC<ModuleMenuIconProps> = ({
  variant,
  size = 60,
}) => (
  <span
    className={s.box}
    style={{ '--icon-size': `${size}px` } as CSSProperties}
    aria-hidden
  >
    {variant === 'curated2' ? (
      <Layer src={curated2Group} inset="15% 22.5% 13.86% 22.5%" />
    ) : (
      <>
        <Layer inset="37.5% 18.75% 11.4% 19.52%">
          <Layer src={csm2Base} inset="0 -27% -32.62% -27%" />
        </Layer>
        {CSM2_VECTORS.map(({ src, inset, blend }) => (
          <Layer key={src} src={src} inset={inset} blend={blend} />
        ))}
      </>
    )}
  </span>
);
