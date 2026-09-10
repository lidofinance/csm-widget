import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { resolveTypeStatus } from './resolve-type-status';

const TARGET = 'CSM_ICS' as OPERATOR_TYPE;
const OTHER = 'CSM_IDVTC' as OPERATOR_TYPE;

type Params = Parameters<typeof resolveTypeStatus>[0];

const resolve = (params: Partial<Params>) =>
  resolveTypeStatus({
    operatorType: undefined,
    targetType: TARGET,
    isOwner: false,
    proof: undefined,
    ownerProof: undefined,
    ...params,
  });

describe('resolveTypeStatus', () => {
  it('returns PENDING without any proof', () => {
    expect(resolve({ operatorType: OTHER })).toBe('PENDING');
  });

  it('returns ISSUED for an own unconsumed proof', () => {
    expect(resolve({ proof: { proof: ['0x1'], isConsumed: false } })).toBe(
      'ISSUED',
    );
  });

  it('returns CLAIMED for an own consumed proof', () => {
    expect(resolve({ proof: { proof: ['0x1'], isConsumed: true } })).toBe(
      'CLAIMED',
    );
  });

  it('returns CLAIMED for the owner of an operator that already has the type', () => {
    expect(resolve({ operatorType: TARGET, isOwner: true })).toBe('CLAIMED');
  });

  it('ignores the operator type for a non-owner', () => {
    expect(resolve({ operatorType: TARGET })).toBe('PENDING');
  });

  it('keeps a non-owner own proof visible on an already typed operator', () => {
    expect(
      resolve({
        operatorType: TARGET,
        proof: { proof: ['0x1'], isConsumed: false },
      }),
    ).toBe('ISSUED');
  });

  it('returns OWNER_ISSUED for an unconsumed owner proof', () => {
    expect(resolve({ ownerProof: { proof: ['0x1'], isConsumed: false } })).toBe(
      'OWNER_ISSUED',
    );
  });

  it('ignores a consumed owner proof', () => {
    expect(resolve({ ownerProof: { proof: ['0x1'], isConsumed: true } })).toBe(
      'PENDING',
    );
  });

  it('prefers an own proof over a consumed owner proof', () => {
    expect(
      resolve({
        proof: { proof: ['0x1'], isConsumed: false },
        ownerProof: { proof: ['0x2'], isConsumed: true },
      }),
    ).toBe('ISSUED');
  });
});
