import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA } from 'consts/module';
import { OPERATOR_TYPE_METADATA } from 'consts/operator-type-metadata';

export const TYPE_TAGLINES: Partial<Record<OPERATOR_TYPE, string>> = {
  [OPERATOR_TYPE.CSM_DEF]: 'The simplest way to start validating in CSM',
  [OPERATOR_TYPE.CSM_ICS]: 'Get verified and unlock better parameters',
  [OPERATOR_TYPE.CSM_IDVTC]:
    'Join a verified cluster with 3 other solo stakers',
  [OPERATOR_TYPE.CSM2_DEF]:
    'Validate up to 2,048 ETH per key for enhanced economics',
};

export const getTypeTagline = (type?: OPERATOR_TYPE): string => {
  if (!type) return MODULE_METADATA[MODULE_NAME.CM].description;
  return TYPE_TAGLINES[type] ?? OPERATOR_TYPE_METADATA[type].description;
};
