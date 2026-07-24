// TODO: use isAddressEqual from viem instead of compareLowercase when possible
// FIXME: same util in lido-csm-sdk. drop current one and import from sdk
export const compareLowercase = (value1?: string, value2?: string) =>
  value1 !== undefined && value1.toLowerCase() === value2?.toLowerCase();
