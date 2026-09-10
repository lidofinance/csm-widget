import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { resolveTypeStatus } from './resolve-type-status';

const TARGET = 'CSM_ICS' as OPERATOR_TYPE;
const OTHER = 'CSM_IDVTC' as OPERATOR_TYPE;

describe('resolveTypeStatus', () => {
  it('returns PENDING with no proofs and no matching operator type', () => {
    expect(
      resolveTypeStatus({
        operatorType: OTHER,
        targetType: TARGET,
        isOwner: false,
        proof: undefined,
        ownerProof: undefined,
      }),
    ).toBe('PENDING');
  });

  it('returns ISSUED when the connected address has its own unconsumed proof', () => {
    expect(
      resolveTypeStatus({
        operatorType: undefined,
        targetType: TARGET,
        isOwner: false,
        proof: { proof: ['0x1'], isConsumed: false },
        ownerProof: undefined,
      }),
    ).toBe('ISSUED');
  });

  it('returns CLAIMED when the connected address already consumed its own proof', () => {
    expect(
      resolveTypeStatus({
        operatorType: undefined,
        targetType: TARGET,
        isOwner: false,
        proof: { proof: ['0x1'], isConsumed: true },
        ownerProof: undefined,
      }),
    ).toBe('CLAIMED');
  });

  it('returns CLAIMED when the operator already has the target type and the connected address is its owner', () => {
    expect(
      resolveTypeStatus({
        operatorType: TARGET,
        targetType: TARGET,
        isOwner: true,
        proof: undefined,
        ownerProof: undefined,
      }),
    ).toBe('CLAIMED');
  });

  it('falls through to the personal state when the operator has the target type but the connected address is not its owner', () => {
    expect(
      resolveTypeStatus({
        operatorType: TARGET,
        targetType: TARGET,
        isOwner: false,
        proof: undefined,
        ownerProof: undefined,
      }),
    ).toBe('PENDING');
  });

  it('falls through to the applicant own ISSUED state when non-owner has a personal proof, even if the operator already has the target type', () => {
    expect(
      resolveTypeStatus({
        operatorType: TARGET,
        targetType: TARGET,
        isOwner: false,
        proof: { proof: ['0x1'], isConsumed: false },
        ownerProof: undefined,
      }),
    ).toBe('ISSUED');
  });

  it('returns OWNER_ISSUED when the owner proof exists and is not consumed', () => {
    expect(
      resolveTypeStatus({
        operatorType: undefined,
        targetType: TARGET,
        isOwner: false,
        proof: undefined,
        ownerProof: { proof: ['0x1'], isConsumed: false },
      }),
    ).toBe('OWNER_ISSUED');
  });

  it('falls through to PENDING when the owner proof is already consumed', () => {
    expect(
      resolveTypeStatus({
        operatorType: undefined,
        targetType: TARGET,
        isOwner: false,
        proof: undefined,
        ownerProof: { proof: ['0x1'], isConsumed: true },
      }),
    ).toBe('PENDING');
  });

  it('prefers the personal ISSUED state over a consumed owner proof', () => {
    expect(
      resolveTypeStatus({
        operatorType: undefined,
        targetType: TARGET,
        isOwner: false,
        proof: { proof: ['0x1'], isConsumed: false },
        ownerProof: { proof: ['0x2'], isConsumed: true },
      }),
    ).toBe('ISSUED');
  });
});
