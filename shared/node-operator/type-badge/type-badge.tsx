import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import badge0x01 from 'assets/illustrations/operator-type/0x01.svg';
import badge0x02 from 'assets/illustrations/operator-type/0x02.svg';
import badgeIcs from 'assets/illustrations/operator-type/ics.svg';
import badgeIdvtc from 'assets/illustrations/operator-type/idvtc.svg';
import type { DisplayOperatorType } from 'consts';
import { FC } from 'react';
import styled from 'styled-components';
import { OperatorTypeTag } from '../operator-type-tag';

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

const ImgStyle = styled.img<{ $size: TypeBadgeSize }>`
  flex: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  @media (max-width: 439px) {
    width: ${({ $size }) => MOBILE_SIZE[$size]}px;
    height: ${({ $size }) => MOBILE_SIZE[$size]}px;
  }
`;

export const TypeBadge: FC<TypeBadgeProps> = ({ type, size = 52 }) => {
  const src = getOperatorTypeBadge(type);
  if (src) return <ImgStyle src={src} alt="" $size={size} />;
  return type ? <OperatorTypeTag type={type} /> : null;
};
