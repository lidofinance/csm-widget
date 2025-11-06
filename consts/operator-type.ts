import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export const OPERATOR_TYPE_TITLE: Record<OPERATOR_TYPE, string> = {
  [OPERATOR_TYPE.DEF]: 'Default (DEF)',
  [OPERATOR_TYPE.LEA]: 'Legacy Early Adopter (LEA)',
  [OPERATOR_TYPE.ICS]: 'Identified Community Staker (ICS)',
  [OPERATOR_TYPE.CC]: 'Custom Curve (CC)',
};
