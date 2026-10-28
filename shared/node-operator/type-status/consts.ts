import { PATH } from 'consts/urls';

export type TypeProgram = 'ICS' | 'IDVTC';

export const TYPE_PROGRAM: Record<
  TypeProgram,
  { applyPath: PATH; claimPath: PATH; createPath: PATH }
> = {
  ICS: {
    applyPath: PATH.TYPE_ICS_APPLY,
    claimPath: PATH.TYPE_ICS_CLAIM,
    createPath: PATH.CREATE_ICS,
  },
  IDVTC: {
    applyPath: PATH.TYPE_IDVTC_APPLY,
    claimPath: PATH.TYPE_IDVTC_CLAIM,
    createPath: PATH.CREATE_IDVTC,
  },
};
