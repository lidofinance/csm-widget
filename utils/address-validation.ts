export type AddressValidationFile = {
  addresses: string[];
  isBroken: boolean;
};

export const validateAddressLocally = (
  address: string,
  validationFile: AddressValidationFile,
): { isValid: boolean } => {
  if (!address) {
    return { isValid: true }; // No address to validate
  }

  // If file is broken, consider all addresses invalid
  if (validationFile.isBroken) {
    return { isValid: false };
  }

  // Check if address is in the allowed list (case-insensitive)
  const normalizedAddress = address.toLowerCase();
  const isNotValid = validationFile.addresses.some(
    (addr) => addr.toLowerCase() === normalizedAddress,
  );

  const isValid = !isNotValid;

  return { isValid };
};
