type CustomAddressesInput = {
  specifyCustomAddresses: boolean;
  managerAddress?: string;
  rewardsAddress?: string;
};

// The survey API's members endpoints require the caller to be the operator's
// manager or rewards address. On create, the connected address keeps a role
// unless custom addresses reassign BOTH away (an empty custom value falls back
// to the creator on-chain).
export const keepsManageRole = (
  input: CustomAddressesInput,
  address: string,
): boolean =>
  !input.specifyCustomAddresses ||
  [input.managerAddress, input.rewardsAddress].some(
    (custom) => !custom || custom.toLowerCase() === address.toLowerCase(),
  );
