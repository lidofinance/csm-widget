import { randomBytes } from 'crypto';

export const generateAddress = () => {
  return '0x' + randomBytes(20).toString('hex');
};

export const generateWithdrawalCredentials = (isCM = false) => {
  const keyType = isCM ? '0x02' : '0x01';
  // Withdrawal credentials start with 0x01 followed by 11 zero bytes and then the 20-byte address
  return keyType + '00'.repeat(11) + randomBytes(20).toString('hex');
};
