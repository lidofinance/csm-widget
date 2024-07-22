import { DepositData } from 'types';
import { getKeys } from '../cachedKeys';
import { CHAINS } from '@lido-sdk/constants';

export const checkPreviouslySubmittedDuplicates = (
  depositData: DepositData[],
  chainId: CHAINS,
) => {
  const storedKeys = getKeys(chainId);

  depositData.forEach(({ pubkey }) => {
    const hasDuplicate = storedKeys[pubkey] !== undefined;
    if (hasDuplicate) {
      throw new Error(`Key ${pubkey} was previosly submitted`);
    }
  });
};
