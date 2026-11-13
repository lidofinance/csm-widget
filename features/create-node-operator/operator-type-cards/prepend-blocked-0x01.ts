import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';

export type VisibleType = {
  key: string;
  type?: OPERATOR_TYPE;
  href: PATH;
  label: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
  primary: boolean;
  disabledReason?: string;
};

const BLOCKED_0X01: VisibleType = {
  key: OPERATOR_TYPE.CSM_DEF,
  type: OPERATOR_TYPE.CSM_DEF,
  href: PATH.CREATE_0x01,
  label: 'Select 0x01',
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
  primary: true,
  disabledReason:
    "You already have a 0x01 Node Operator. You can't create another one.",
};

export const prependBlocked0x01 = (
  types: VisibleType[],
  blocked: boolean,
): VisibleType[] => {
  if (!blocked || types.some((t) => t.type === OPERATOR_TYPE.CSM_DEF)) {
    return types;
  }
  return [BLOCKED_0X01, ...types];
};
