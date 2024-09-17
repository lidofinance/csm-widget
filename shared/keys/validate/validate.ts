import { DepositData } from 'types';
import { CHAINS } from '@lido-sdk/constants';
import { checkLength } from './check-length';
import { checkDuplicates } from './check-duplicates';
import { checkPreviouslySubmittedDuplicates } from './check-previously-submitted-duplicates';
import { checkItem } from './check-item';
import { checkNetworkDuplicates } from './check-network-duplicates';

export const validate = async (
  depositData: DepositData[],
  chainId: CHAINS,
  wc: string,
  keysUploadLimit: number,
) => {
  try {
    depositData.forEach((data) => checkItem(data, chainId, wc));
    checkLength(depositData, keysUploadLimit);
    checkDuplicates(depositData);
    checkPreviouslySubmittedDuplicates(depositData, chainId);
    await checkNetworkDuplicates(depositData, chainId);

    return null;
  } catch (error) {
    return error as Error;
  }
};
