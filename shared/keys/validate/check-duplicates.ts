import { trimAddress } from '@lidofinance/address';
import { DepositData } from 'types';

export const checkDuplicates = (signingKeys: DepositData[]) => {
  const duplicates = new Map<string, number[]>();

  for (const [i, depositData] of signingKeys.entries()) {
    if (!duplicates.has(depositData.pubkey)) {
      duplicates.set(depositData.pubkey, []);
    }

    const keyDuplicates = duplicates.get(depositData.pubkey);
    if (keyDuplicates) {
      keyDuplicates.push(i);
    }
  }

  duplicates.forEach((dupKeyIndexes, pubkey) => {
    if (dupKeyIndexes.length > 1) {
      throw new Error(`Key ${trimAddress(pubkey, 16)} has duplicates`);
    }
  });
};
