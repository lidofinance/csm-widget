import { DepositData } from 'types';
import { formatHex } from './formatHex';

export const formatKeys = (keys: DepositData[]) => {
  const publicKeys = keys.map((key) => key.pubkey);
  const signatures = keys.map((key) => key.signature);

  return {
    keysCount: keys.length,
    publicKeys: formatHex(publicKeys),
    signatures: formatHex(signatures),
  };
};
