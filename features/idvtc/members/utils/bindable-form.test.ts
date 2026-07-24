import { isBindableForm } from './bindable-form';

describe('isBindableForm', () => {
  it('returns true for an APPROVED form that is not yet bound', () => {
    expect(
      isBindableForm({ status: 'APPROVED', boundToNodeOperatorId: null }),
    ).toBe(true);
  });

  it('returns false for an APPROVED form already bound to an operator', () => {
    expect(
      isBindableForm({ status: 'APPROVED', boundToNodeOperatorId: 'csm-42' }),
    ).toBe(false);
  });

  it('returns false for REVIEW and REJECTED forms', () => {
    expect(
      isBindableForm({ status: 'REVIEW', boundToNodeOperatorId: null }),
    ).toBe(false);
    expect(
      isBindableForm({ status: 'REJECTED', boundToNodeOperatorId: null }),
    ).toBe(false);
  });

  it('returns false when there is no form', () => {
    expect(isBindableForm(undefined)).toBe(false);
  });
});
