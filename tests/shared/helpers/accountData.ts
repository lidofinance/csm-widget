import { randomBytes } from 'crypto';

export const generateAddress = () => {
  return '0x' + randomBytes(20).toString('hex');
};

export const generateWithdrawalCredentials = () => {
  // Withdrawal credentials start with 0x01 followed by 11 zero bytes and then the 20-byte address
  return '0x01' + '00'.repeat(11) + randomBytes(20).toString('hex');
};
