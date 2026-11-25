import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import type { DisplayOperatorType } from 'consts';

export type AvailableType = {
  type: DisplayOperatorType;
  href: PATH;
};

export type AvailableTypesFlags = {
  canCreate0x01: boolean;
  has0x02: boolean;
};

export const getAvailableTypes = (
  current: DisplayOperatorType | undefined,
  { canCreate0x01, has0x02 }: AvailableTypesFlags,
): AvailableType[] => {
  const candidates: { type: OPERATOR_TYPE; href: PATH | undefined }[] = [
    { type: OPERATOR_TYPE.CSM_ICS, href: PATH.TYPE_ICS_SYSTEM },
    { type: OPERATOR_TYPE.CSM_IDVTC, href: PATH.TYPE_IDVTC_DESCRIPTION },
    {
      type: OPERATOR_TYPE.CSM_DEF,
      href: canCreate0x01 ? PATH.CREATE_0x01 : undefined,
    },
    {
      type: OPERATOR_TYPE.CSM2_DEF,
      href: has0x02 ? PATH.TYPE_0X02 : undefined,
    },
  ];

  return candidates.flatMap(({ type, href }) =>
    href && type !== current ? [{ type, href }] : [],
  );
};
