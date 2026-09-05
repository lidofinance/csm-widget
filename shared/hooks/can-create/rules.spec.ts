import type { AddressProof } from '@lidofinance/lido-csm-sdk';
import {
  canCreatePairedType,
  hasUnconsumedProof,
  PairedTypeRulesInput,
} from './rules';

const CURVE = 2n;
const PAIRED_CURVE = 3n;

const base: PairedTypeRulesInput = {
  eligible: true,
  curveId: CURVE,
  pairedCurveId: PAIRED_CURVE,
  hasCsmOperator: false,
  activeOperatorCurveId: undefined,
};

const input = (patch: Partial<PairedTypeRulesInput>) => ({
  ...base,
  ...patch,
});

describe('canCreatePairedType', () => {
  it('offers from scratch when eligible', () => {
    expect(canCreatePairedType(base)).toBe(true);
  });

  it('withholds when not eligible', () => {
    expect(canCreatePairedType(input({ eligible: false }))).toBe(false);
  });

  it('offers when active operator is on the paired curve', () => {
    expect(
      canCreatePairedType(
        input({ hasCsmOperator: true, activeOperatorCurveId: PAIRED_CURVE }),
      ),
    ).toBe(true);
  });

  it('withholds when active operator is on another curve', () => {
    expect(
      canCreatePairedType(
        input({ hasCsmOperator: true, activeOperatorCurveId: 1n }),
      ),
    ).toBe(false);
  });

  it('withholds when own curveId is undefined', () => {
    expect(canCreatePairedType(input({ curveId: undefined }))).toBe(false);
  });

  it('withholds when pairedCurveId is undefined and an operator exists', () => {
    expect(
      canCreatePairedType(
        input({ hasCsmOperator: true, pairedCurveId: undefined }),
      ),
    ).toBe(false);
  });
});

describe('hasUnconsumedProof', () => {
  it('is false when proof is undefined', () => {
    expect(hasUnconsumedProof(undefined)).toBe(false);
  });

  it('is false when the proof is consumed', () => {
    const proof: AddressProof = { proof: [], isConsumed: true };
    expect(hasUnconsumedProof(proof)).toBe(false);
  });

  it('is true when the proof is unconsumed', () => {
    const proof: AddressProof = { proof: [], isConsumed: false };
    expect(hasUnconsumedProof(proof)).toBe(true);
  });
});
