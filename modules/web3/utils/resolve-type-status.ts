// import type only: the SDK barrel pulls ESM deps that jest cannot load
import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export type OperatorTypeStatus =
  'PENDING' | 'ISSUED' | 'OWNER_ISSUED' | 'CLAIMED';

type ProofState = {
  proof?: unknown;
  isConsumed?: boolean;
};

type ResolveTypeStatusParams = {
  operatorType: OPERATOR_TYPE | undefined;
  targetType: OPERATOR_TYPE;
  isOwner: boolean;
  proof: ProofState | undefined;
  ownerProof: ProofState | undefined;
};

export const resolveTypeStatus = ({
  operatorType,
  targetType,
  isOwner,
  proof,
  ownerProof,
}: ResolveTypeStatusParams): OperatorTypeStatus => {
  // operatorType proves the operator claimed the type, not that this wallet did
  if ((operatorType === targetType && isOwner) || proof?.isConsumed)
    return 'CLAIMED';
  if (proof?.proof) return 'ISSUED';
  // a consumed owner proof can't be reused, so it is not live eligibility
  if (ownerProof?.proof && !ownerProof.isConsumed) return 'OWNER_ISSUED';
  return 'PENDING';
};
