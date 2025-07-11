import { randomBytes } from 'crypto';

export const generateAddress = () => {
  return '0x' + randomBytes(20).toString('hex');
};
