import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import badge0x01 from 'assets/illustrations/operator-type/0x01.svg';
import badge0x02 from 'assets/illustrations/operator-type/0x02.svg';
import badgeIcs from 'assets/illustrations/operator-type/ics.svg';
import badgeIdvtc from 'assets/illustrations/operator-type/idvtc.svg';
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
): string | undefined => (type ? BADGES[type] : undefined);

export const TypeBadge: FC<TypeBadgeProps> = ({ type, size = 52 }) => {
  const src = getOperatorTypeBadge(type);
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
