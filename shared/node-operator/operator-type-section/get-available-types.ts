import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import type { DisplayOperatorType } from 'consts';

export type AvailableType = {
  type: DisplayOperatorType;
  href: PATH;
};

export type AvailableTypesFlags = {
  canCreate0x01: boolean;
  canCreate0x02: boolean;
};

export const getAvailableTypes = (
  current: DisplayOperatorType | undefined,
  { canCreate0x01, canCreate0x02 }: AvailableTypesFlags,
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
      href: canCreate0x02 ? PATH.CREATE_0x02 : undefined,
    },
  ];

  return candidates.flatMap(({ type, href }) =>
    href && type !== current ? [{ type, href }] : [],
  );
};
