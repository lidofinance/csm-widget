import type { OperatorTypeStatus } from 'modules/web3';
import { getApplicationDisplayState } from './application-display-state';

const get = (
  formStatus: Parameters<typeof getApplicationDisplayState>[0]['formStatus'],
  typeStatus: OperatorTypeStatus,
  hasOperator = true,
) => getApplicationDisplayState({ formStatus, typeStatus, hasOperator });

describe('getApplicationDisplayState', () => {
  it('REVIEW + PENDING -> pending application only', () => {
    expect(get('REVIEW', 'PENDING')).toEqual({
      application: 'pending',
      type: undefined,
      cta: 'viewDetails',
    });
  });

  it('REJECTED + PENDING -> rejected application only', () => {
    expect(get('REJECTED', 'PENDING')).toEqual({
      application: 'rejected',
      type: undefined,
      cta: 'viewDetails',
    });
  });

  it('APPROVED + PENDING -> approved application and pending type', () => {
    expect(get('APPROVED', 'PENDING')).toEqual({
      application: 'approved',
      type: 'pending',
      cta: 'viewDetails',
    });
  });

  it('APPROVED + ISSUED with operator -> claim', () => {
    expect(get('APPROVED', 'ISSUED', true)).toEqual({
      application: 'approved',
      type: 'issued',
      cta: 'claim',
    });
  });

  it('APPROVED + ISSUED without operator -> create', () => {
    expect(get('APPROVED', 'ISSUED', false)).toEqual({
      application: 'approved',
      type: 'issued',
      cta: 'create',
    });
  });

  it('APPROVED + CLAIMED -> approvedClaimed and claimed type', () => {
    expect(get('APPROVED', 'CLAIMED')).toEqual({
      application: 'approvedClaimed',
      type: 'claimed',
      cta: 'viewDetails',
    });
  });

  it.each([
    ['PROOF_USED', 'proofUsed'],
    ['PROOF_USED_ELSEWHERE', 'proofUsedElsewhere'],
  ] as const)('%s maps to %s', (typeStatus, type) => {
    expect(get('APPROVED', typeStatus)).toEqual({
      application: 'approved',
      type,
      cta: 'viewDetails',
    });
  });

  it('REJECTED keeps rejected application next to a used proof', () => {
    expect(get('REJECTED', 'PROOF_USED').application).toBe('rejected');
  });

  it('no formStatus and PENDING -> empty', () => {
    expect(get(undefined, 'PENDING')).toEqual({});
  });

  it.each([
    ['ISSUED', 'issued', 'claim'],
    ['CLAIMED', 'claimed', 'viewDetails'],
    ['PROOF_USED', 'proofUsed', 'viewDetails'],
    ['PROOF_USED_ELSEWHERE', 'proofUsedElsewhere', 'viewDetails'],
    ['ISSUED_NOT_OWNER', 'issuedNotOwner', 'viewDetails'],
    ['OWNER_ISSUED', 'ownerIssued', 'viewDetails'],
    ['OTHER_ISSUED', 'otherIssued', 'viewDetails'],
  ] as const)(
    'no formStatus + %s still maps the type part',
    (typeStatus, type, cta) => {
      expect(get(undefined, typeStatus)).toEqual({
        application: undefined,
        type,
        cta,
      });
    },
  );

  it('unmapped typeStatus value yields no type', () => {
    expect(get('REVIEW', 'SOMETHING_NEW' as OperatorTypeStatus)).toEqual({
      application: 'pending',
      type: undefined,
      cta: 'viewDetails',
    });
  });
});
