export type ClaimTypeAction =
  | 'wrong-module'
  | 'paused'
  | 'claimed'
  | 'claimed-with-proof'
  | 'not-eligible'
  | 'no-access'
  | 'claim';

export type ClaimTypeActionInput = {
  isCSM: boolean;
  paused?: boolean;
  proof?: { proof: unknown; isConsumed: boolean };
  currentCurveId?: bigint;
  newCurveId?: bigint;
  canClaim: boolean;
};

export const getClaimTypeAction = ({
  isCSM,
  paused,
  proof,
  currentCurveId,
  newCurveId,
  canClaim,
}: ClaimTypeActionInput): ClaimTypeAction => {
  // Claim types are CSM curves: they can't be claimed onto another module's operator
  if (!isCSM) return 'wrong-module';
  if (paused) return 'paused';

  const isEmpty = !proof?.proof || proof.isConsumed;

  if (currentCurveId !== undefined && currentCurveId === newCurveId) {
    return isEmpty ? 'claimed' : 'claimed-with-proof';
  }
  if (isEmpty) return 'not-eligible';
  if (!canClaim) return 'no-access';

  return 'claim';
};
