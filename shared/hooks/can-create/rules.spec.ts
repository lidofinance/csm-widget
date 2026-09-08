import type {
  AddressProof,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import type { Address } from 'viem';
import {
  canCreatePairedType,
  hasOperatorRole,
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

describe('hasOperatorRole', () => {
  const MANAGER: Address = '0x0000000000000000000000000000000000000001';
  const REWARDS: Address = '0x0000000000000000000000000000000000000002';
  const CLAIMER: Address = '0x0000000000000000000000000000000000000003';

  const operator: Pick<
    NodeOperatorShortInfo,
    'managerAddress' | 'rewardsAddress'
  > = {
    managerAddress: MANAGER,
    rewardsAddress: REWARDS,
  };

  it('is true for the manager address', () => {
    expect(hasOperatorRole(operator, MANAGER)).toBe(true);
  });

  it('is true for the rewards address', () => {
    expect(hasOperatorRole(operator, REWARDS)).toBe(true);
  });

  it('is false for an address that is only claimer', () => {
    expect(hasOperatorRole(operator, CLAIMER)).toBe(false);
  });

  it('is false when address is undefined', () => {
    expect(hasOperatorRole(operator, undefined)).toBe(false);
  });

  it('matches case-insensitively', () => {
    const upperCased: Address = `0x${MANAGER.slice(2).toUpperCase()}`;
    expect(hasOperatorRole(operator, upperCased)).toBe(true);
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
