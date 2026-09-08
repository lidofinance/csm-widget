import type { AddressProof } from '@lidofinance/lido-csm-sdk';
import {
  canCreatePairedType,
  hasUnconsumedProof,
  holdsUnconsumedProof,
  PairedOptionState,
  PairedTypeRulesInput,
  resolvePairedOptionKind,
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

describe('holdsUnconsumedProof', () => {
  it('is false when none of the proofs are unconsumed', () => {
    expect(holdsUnconsumedProof(undefined, undefined)).toBe(false);
  });

  it('is true when one of the proofs is unconsumed', () => {
    const proof: AddressProof = { proof: [], isConsumed: false };
    expect(holdsUnconsumedProof(undefined, proof)).toBe(true);
  });
});

describe('resolvePairedOptionKind', () => {
  const state = (patch: Partial<PairedOptionState>): PairedOptionState => ({
    canCreate: false,
    proof: undefined,
    isPaused: false,
    ...patch,
  });

  it('offers create when canCreate, regardless of applyEnabled', () => {
    expect(resolvePairedOptionKind(state({ canCreate: true }), false)).toBe(
      'create',
    );
  });

  it('offers apply when not creatable, apply enabled, unconsumed/undefined proof, not paused', () => {
    expect(resolvePairedOptionKind(state({}), true)).toBe('apply');
    expect(
      resolvePairedOptionKind(
        state({ proof: { proof: [], isConsumed: false } }),
        true,
      ),
    ).toBe('apply');
  });

  it('withholds when applyEnabled is false', () => {
    expect(resolvePairedOptionKind(state({}), false)).toBe(null);
  });

  it('withholds when paused', () => {
    expect(resolvePairedOptionKind(state({ isPaused: true }), true)).toBe(null);
  });

  it('withholds when the proof is consumed', () => {
    expect(
      resolvePairedOptionKind(
        state({ proof: { proof: [], isConsumed: true } }),
        true,
      ),
    ).toBe(null);
  });
});
