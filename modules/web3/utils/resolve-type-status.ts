// import type only: the SDK barrel pulls ESM deps that jest cannot load
import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export type TypeStatus = 'PENDING' | 'ISSUED' | 'OWNER_ISSUED' | 'CLAIMED';

export type ProofState = {
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
}: ResolveTypeStatusParams): TypeStatus => {
  // operatorType alone only proves the *operator* claimed the type, not this wallet
  if ((operatorType === targetType && isOwner) || proof?.isConsumed)
    return 'CLAIMED';
  if (proof?.proof) return 'ISSUED';
  // a consumed owner proof can't be reused, so it isn't live eligibility
  if (ownerProof?.proof && !ownerProof.isConsumed) return 'OWNER_ISSUED';
  return 'PENDING';
};
