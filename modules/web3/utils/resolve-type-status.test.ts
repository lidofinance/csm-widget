import type { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { resolveTypeStatus } from './resolve-type-status';

const TARGET = 'CSM_ICS' as OPERATOR_TYPE;
const OTHER = 'CSM_IDVTC' as OPERATOR_TYPE;
const DEF = 'CSM_DEF' as OPERATOR_TYPE;

const LIVE = { proof: ['0x1'], isConsumed: false };
const USED = { proof: ['0x1'], isConsumed: true };

type Params = Parameters<typeof resolveTypeStatus>[0];

const resolve = (params: Partial<Params>) =>
  resolveTypeStatus({
    operatorType: undefined,
    targetType: TARGET,
    pairedType: OTHER,
    hasOperator: true,
    isOwner: false,
    proof: undefined,
    otherProof: undefined,
    ...params,
  });

describe('resolveTypeStatus', () => {
  it('PENDING without proofs', () => {
    expect(resolve({ operatorType: OTHER })).toBe('PENDING');
  });

  it('PENDING without operator and proofs', () => {
    expect(resolve({ hasOperator: false })).toBe('PENDING');
  });

  it('CLAIMED when the operator has the type', () => {
    expect(resolve({ operatorType: TARGET })).toBe('CLAIMED');
    expect(resolve({ operatorType: TARGET, isOwner: true })).toBe('CLAIMED');
  });

  it('ignores operator type without an operator', () => {
    expect(resolve({ operatorType: TARGET, hasOperator: false })).toBe(
      'PENDING',
    );
  });

  it('CLAIMED beats own live proof for a non-owner', () => {
    expect(resolve({ operatorType: TARGET, proof: LIVE })).toBe('CLAIMED');
  });

  it('CLAIMED beats owner live proof', () => {
    expect(
      resolve({ operatorType: TARGET, proof: LIVE, otherProof: LIVE }),
    ).toBe('CLAIMED');
  });

  it('ISSUED for own live proof without an operator', () => {
    expect(resolve({ hasOperator: false, proof: LIVE })).toBe('ISSUED');
  });

  it('ISSUED for the owner with own live proof', () => {
    expect(resolve({ isOwner: true, proof: LIVE })).toBe('ISSUED');
  });

  it('ISSUED for the owner with own live proof beats other live proof', () => {
    expect(resolve({ isOwner: true, proof: LIVE, otherProof: LIVE })).toBe(
      'ISSUED',
    );
  });

  it('ISSUED_NOT_OWNER for a non-owner live proof', () => {
    expect(resolve({ proof: LIVE })).toBe('ISSUED_NOT_OWNER');
  });

  it('ISSUED_NOT_OWNER ignores a consumed other proof', () => {
    expect(resolve({ proof: LIVE, otherProof: USED })).toBe('ISSUED_NOT_OWNER');
  });

  it('OWNER_ISSUED beats own live proof for a non-owner', () => {
    expect(resolve({ proof: LIVE, otherProof: LIVE })).toBe('OWNER_ISSUED');
  });

  it('OWNER_ISSUED for a non-owner with a live owner proof only', () => {
    expect(resolve({ otherProof: LIVE })).toBe('OWNER_ISSUED');
  });

  it('OTHER_ISSUED for the owner without own proof and other live proof', () => {
    expect(resolve({ isOwner: true, otherProof: LIVE })).toBe('OTHER_ISSUED');
  });

  it('OTHER_ISSUED beats own consumed proof', () => {
    expect(resolve({ isOwner: true, proof: USED, otherProof: LIVE })).toBe(
      'OTHER_ISSUED',
    );
  });

  it('OWNER_ISSUED beats own consumed proof', () => {
    expect(resolve({ proof: USED, otherProof: LIVE })).toBe('OWNER_ISSUED');
  });

  it('PROOF_USED for own consumed proof when the operator has the paired type', () => {
    expect(resolve({ operatorType: OTHER, proof: USED })).toBe('PROOF_USED');
  });

  it('PROOF_USED_ELSEWHERE for own consumed proof when the operator has another type', () => {
    expect(resolve({ operatorType: DEF, proof: USED })).toBe(
      'PROOF_USED_ELSEWHERE',
    );
  });

  it('PROOF_USED for own consumed proof without an operator', () => {
    expect(resolve({ hasOperator: false, proof: USED })).toBe('PROOF_USED');
  });

  it('ignores a consumed other proof', () => {
    expect(resolve({ otherProof: USED })).toBe('PENDING');
  });
});
