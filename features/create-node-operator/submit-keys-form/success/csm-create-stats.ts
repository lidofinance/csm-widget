import { OPERATOR_TYPE_METADATA } from 'consts/operator-type-metadata';
import type { CreateSuccess } from 'features/create-node-operator/create-success/create-success';
import { getOperatorName } from 'shared/node-operator/operator-name';
import { formatBalance } from 'utils/format-balance';
import { getTokenDisplayName } from 'utils/get-token-display-name';

export type CsmCreateStats = {
  operatorName: string;
  typeShort: string;
  keysCount?: number;
  bond?: string;
};

export const getCsmCreateStats = ({
  operator,
  type,
  keys,
  bondAmount,
  bondToken,
}: CreateSuccess): CsmCreateStats => ({
  operatorName: getOperatorName(operator),
  typeShort: OPERATOR_TYPE_METADATA[type].short,
  keysCount: keys?.length,
  bond:
    bondAmount !== undefined && bondToken
      ? `${formatBalance(bondAmount, { trimTrailingZeros: true }).trimmed} ${getTokenDisplayName(bondToken)}`
      : undefined,
});
