import { CHAINS } from '@lido-sdk/constants';
import { trimAddress } from '@lidofinance/address';
import { DepositData } from 'types';
import { checkKeys } from '../cachedKeys';
import { TRIM_LENGTH } from './constants';

export const checkPreviouslySubmittedDuplicates = (
  depositData: DepositData[],
  chainId: CHAINS,
  blockNumber?: number,
) => {
  const keys = depositData.map(({ pubkey }) => pubkey);
  const duplicates = checkKeys(keys, chainId, blockNumber);

  if (duplicates.length > 0) {
    throw new Error(
      `pubkey ${trimAddress(duplicates[0], TRIM_LENGTH)} was previously submitted`,
    );
  }
};
