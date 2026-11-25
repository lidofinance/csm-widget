import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import type { DisplayOperatorType } from 'consts';
import { CSSProperties, FC, useRef } from 'react';
import s from './interactive-type-badge.module.css';
import { getOperatorTypeBadge, TypeBadge } from './type-badge';
import { BadgeEffectConfig, useBadgeTilt } from './use-badge-tilt';

const EFFECTS: Partial<Record<DisplayOperatorType, BadgeEffectConfig>> = {
  [OPERATOR_TYPE.CSM_ICS]: {
    rgb: '10, 76, 96',
    colors: ['#08D1FF', '#88F493', '#4FE3C9'],
  },
  [OPERATOR_TYPE.CSM_DEF]: {
    rgb: '48, 67, 82',
    colors: ['#5B6F80', '#A9B3BC', '#D7D2CC'],
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    rgb: '120, 60, 140',
    colors: ['#B98BFF', '#FF7FC3', '#C4A8FF'],
  },
  [OPERATOR_TYPE.CSM2_DEF]: {
    rgb: '0, 46, 93',
    colors: ['#2381E0', '#6FB2F5', '#002E5D'],
  },
};

const FALLBACK: BadgeEffectConfig = {
  rgb: '48, 67, 82',
  colors: ['#5B6F80', '#A9B3BC', '#D7D2CC'],
};

export type InteractiveTypeBadgeProps = {
  type: DisplayOperatorType;
};

export const InteractiveTypeBadge: FC<InteractiveTypeBadgeProps> = ({
  type,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const config = EFFECTS[type] ?? FALLBACK;
  useBadgeTilt(sceneRef, iconRef, sparksRef, config);

  if (!getOperatorTypeBadge(type)) return <TypeBadge type={type} size={240} />;

  return (
    <div
      ref={sceneRef}
      className={s.scene}
      style={{ '--shadow-rgb': config.rgb } as CSSProperties}
      aria-hidden
    >
      <div ref={iconRef} className={s.icon}>
        <TypeBadge type={type} size={240} />
      </div>
      <div ref={sparksRef} className={s.sparks} />
    </div>
  );
};
