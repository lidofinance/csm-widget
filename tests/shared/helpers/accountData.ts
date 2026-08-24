import { randomBytes } from 'crypto';
import { getAddress } from 'viem';

/**
 * Generates a random address.
 *
 * Pass `checksum = true` when the address is compared against what the UI
 * renders after reading it back from chain: the widget shows such addresses in
 * EIP-55 checksum form, and Playwright text assertions are case-sensitive.
 * For filling inputs the default lowercase form is fine — viem accepts it.
 */
export const generateAddress = (checksum = false) => {
  const address = '0x' + randomBytes(20).toString('hex');
  return checksum ? getAddress(address) : address;
};

export const generateWithdrawalCredentials = (isCM = false) => {
  const keyType = isCM ? '0x02' : '0x01';
  // Withdrawal credentials start with 0x01 followed by 11 zero bytes and then the 20-byte address
  return keyType + '00'.repeat(11) + randomBytes(20).toString('hex');
};
