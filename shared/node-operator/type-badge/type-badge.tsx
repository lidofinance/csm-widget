import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import badge0x01 from 'assets/illustrations/operator-type/0x01.svg';
import badge0x02 from 'assets/illustrations/operator-type/0x02.svg';
import badgeIcs from 'assets/illustrations/operator-type/ics.svg';
import badgeIdvtc from 'assets/illustrations/operator-type/idvtc.svg';
import badge0x01Large from 'assets/illustrations/operator-type/0x01-240.svg';
import badge0x02Large from 'assets/illustrations/operator-type/0x02-240.svg';
import badgeIcsLarge from 'assets/illustrations/operator-type/ics-240.svg';
import badgeIdvtcLarge from 'assets/illustrations/operator-type/idvtc-240.svg';
import type { DisplayOperatorType } from 'consts';
import { CSSProperties, FC } from 'react';
import { OperatorTypeTag } from '../operator-type-tag';
import s from './type-badge.module.css';

const BADGES: Partial<Record<DisplayOperatorType, string>> = {
  [OPERATOR_TYPE.CSM_DEF]: badge0x01,
  [OPERATOR_TYPE.CSM2_DEF]: badge0x02,
  [OPERATOR_TYPE.CSM_ICS]: badgeIcs,
  [OPERATOR_TYPE.CSM_IDVTC]: badgeIdvtc,
};

// The 240px artwork is a separate drawing (glossier rim), not the 52px one scaled up.
const LARGE_BADGES: Partial<Record<DisplayOperatorType, string>> = {
  [OPERATOR_TYPE.CSM_DEF]: badge0x01Large,
  [OPERATOR_TYPE.CSM2_DEF]: badge0x02Large,
  [OPERATOR_TYPE.CSM_ICS]: badgeIcsLarge,
  [OPERATOR_TYPE.CSM_IDVTC]: badgeIdvtcLarge,
};

const MOBILE_SIZE: Record<TypeBadgeSize, number> = {
  52: 52,
  120: 96,
  240: 160,
};

export type TypeBadgeSize = 52 | 120 | 240;

export type TypeBadgeProps = {
  type?: DisplayOperatorType;
  size?: TypeBadgeSize;
};

export const getOperatorTypeBadge = (
  type?: DisplayOperatorType,
  size?: TypeBadgeSize,
): string | undefined =>
  type ? (size === 240 ? LARGE_BADGES : BADGES)[type] : undefined;

export const TypeBadge: FC<TypeBadgeProps> = ({ type, size = 52 }) => {
  const src = getOperatorTypeBadge(type, size);
  if (src)
    return (
      <img
        className={s.img}
        src={src}
        alt=""
        style={
          {
            '--badge-size': `${size}px`,
            '--badge-size-mobile': `${MOBILE_SIZE[size]}px`,
          } as CSSProperties
        }
      />
    );
  return type ? <OperatorTypeTag type={type} /> : null;
};
