// import type only: the SDK barrel pulls ESM deps that jest cannot load
import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export type OperatorTypeStatus =
  | 'PENDING'
  | 'CLAIMED'
  | 'PROOF_USED'
  | 'PROOF_USED_ELSEWHERE'
  | 'ISSUED'
  | 'ISSUED_NOT_OWNER'
  | 'OWNER_ISSUED'
  | 'OTHER_ISSUED';

type ProofState = {
  proof?: unknown;
  isConsumed?: boolean;
};

type ResolveTypeStatusParams = {
  operatorType: OPERATOR_TYPE | undefined;
  targetType: OPERATOR_TYPE;
  pairedType: OPERATOR_TYPE;
  hasOperator: boolean;
  isOwner: boolean;
  proof: ProofState | undefined;
  otherProof: ProofState | undefined;
};

const isLive = (p: ProofState | undefined) => !!p?.proof && !p.isConsumed;

export const resolveTypeStatus = ({
  operatorType,
  targetType,
  pairedType,
  hasOperator,
  isOwner,
  proof,
  otherProof,
}: ResolveTypeStatusParams): OperatorTypeStatus => {
  const ownLive = isLive(proof);
  if (hasOperator && operatorType === targetType) return 'CLAIMED';
  // without an operator there is nothing to claim onto, so ISSUED means "create"
  if (ownLive && (isOwner || !hasOperator)) return 'ISSUED';
  // the other role address is the owner iff the wallet isn't
  if (isLive(otherProof)) return isOwner ? 'OTHER_ISSUED' : 'OWNER_ISSUED';
  if (ownLive) return 'ISSUED_NOT_OWNER';
  // An in-place ICS<->IDVTC switch consumes the proof on this very operator,
  // so "elsewhere" is only provable when it holds neither type.
  if (proof?.isConsumed)
    return hasOperator && operatorType !== pairedType
      ? 'PROOF_USED_ELSEWHERE'
      : 'PROOF_USED';
  return 'PENDING';
};
