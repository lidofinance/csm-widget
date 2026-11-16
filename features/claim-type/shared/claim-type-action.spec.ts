import {
  type ClaimTypeActionInput,
  getClaimTypeAction,
} from './claim-type-action';

const LIVE_PROOF = { proof: ['0x01'], isConsumed: false };
const CONSUMED_PROOF = { proof: ['0x01'], isConsumed: true };

const base: ClaimTypeActionInput = {
  isCSM: true,
  paused: false,
  proof: LIVE_PROOF,
  currentCurveId: 0n,
  newCurveId: 2n,
  canClaim: true,
};

const action = (patch: Partial<ClaimTypeActionInput> = {}) =>
  getClaimTypeAction({ ...base, ...patch });

describe('getClaimTypeAction', () => {
  it('claims with a live proof and the owner role', () => {
    expect(action()).toBe('claim');
  });

  it('reports the wrong module before anything else', () => {
    expect(action({ isCSM: false, paused: true, proof: undefined })).toBe(
      'wrong-module',
    );
  });

  it('reports paused before the claimed state', () => {
    expect(action({ paused: true, currentCurveId: 2n })).toBe('paused');
  });

  it('is claimed-with-proof on the type curve with a live proof', () => {
    expect(action({ currentCurveId: 2n })).toBe('claimed-with-proof');
  });

  it('is claimed on the type curve with a consumed or missing proof', () => {
    expect(action({ currentCurveId: 2n, proof: CONSUMED_PROOF })).toBe(
      'claimed',
    );
    expect(
      action({ currentCurveId: 2n, proof: { proof: null, isConsumed: false } }),
    ).toBe('claimed');
    expect(action({ currentCurveId: 2n, proof: undefined })).toBe('claimed');
  });

  it('never counts an unknown current curve as claimed', () => {
    expect(action({ currentCurveId: undefined, newCurveId: undefined })).toBe(
      'claim',
    );
  });

  it('is not eligible without a live proof', () => {
    expect(action({ proof: undefined })).toBe('not-eligible');
    expect(action({ proof: CONSUMED_PROOF })).toBe('not-eligible');
  });

  it('checks eligibility before access', () => {
    expect(action({ proof: undefined, canClaim: false })).toBe('not-eligible');
  });

  it('is no-access for an address that cannot claim', () => {
    expect(action({ canClaim: false })).toBe('no-access');
  });
});
