import type { AddressProof } from '@lidofinance/lido-csm-sdk';

export const hasUnconsumedProof = (proof: AddressProof | undefined): boolean =>
  !!proof?.proof && !proof.isConsumed;

export type PairedTypeRulesInput = {
  /** Wallet holds an unconsumed, unpaused proof for this type. */
  eligible: boolean;
  curveId: bigint | undefined;
  /** Curve id of the other half of the ICS<->IDVTC pair. */
  pairedCurveId: bigint | undefined;
  hasCsmOperator: boolean;
  /** Curve id of the selected operator when it lives in CSM. */
  activeOperatorCurveId: bigint | undefined;
};

// The ICS<->IDVTC pair is the only sanctioned second CSM operator: each type
// is reachable either from scratch or from an operator on the other curve.
export const canCreatePairedType = ({
  eligible,
  curveId,
  pairedCurveId,
  hasCsmOperator,
  activeOperatorCurveId,
}: PairedTypeRulesInput): boolean =>
  eligible &&
  curveId !== undefined &&
  (!hasCsmOperator ||
    (pairedCurveId !== undefined && activeOperatorCurveId === pairedCurveId));
