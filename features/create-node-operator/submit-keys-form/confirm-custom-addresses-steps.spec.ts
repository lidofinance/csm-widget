import { getAddressesConfirmState } from './confirm-custom-addresses-steps';

describe('getAddressesConfirmState', () => {
  it('has two steps with extended manager permissions, first one continues', () => {
    expect(getAddressesConfirmState(0, true)).toEqual({
      stepsCount: 2,
      isLast: false,
      actionLabel: 'Continue',
    });
  });

  it('confirms on the second step with extended manager permissions', () => {
    expect(getAddressesConfirmState(1, true)).toEqual({
      stepsCount: 2,
      isLast: true,
      actionLabel: 'Confirm',
    });
  });

  it('has a single confirming step without extended manager permissions', () => {
    expect(getAddressesConfirmState(0, false)).toEqual({
      stepsCount: 1,
      isLast: true,
      actionLabel: 'Confirm',
    });
  });
});
