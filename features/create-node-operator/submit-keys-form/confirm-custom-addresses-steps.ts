export type AddressesConfirmState = {
  stepsCount: number;
  isLast: boolean;
  actionLabel: 'Continue' | 'Confirm';
};

// The permissions step only applies to extended manager permissions
export const getAddressesConfirmState = (
  step: number,
  extendedManagerPermissions: boolean,
): AddressesConfirmState => {
  const stepsCount = extendedManagerPermissions ? 2 : 1;
  const isLast = step >= stepsCount - 1;
  return { stepsCount, isLast, actionLabel: isLast ? 'Confirm' : 'Continue' };
};
