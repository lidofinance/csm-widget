import { BytesLike } from 'ethers';

export const formatHex = (keys: string[]): BytesLike => {
  return '0x' + keys.join('');
};
