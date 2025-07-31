import { DepositData } from 'types';
import { checkLength } from './check-length';
import { checkDuplicates } from './check-duplicates';
import { checkPreviouslySubmittedDuplicates } from './check-previously-submitted-duplicates';
import { checkItem } from './check-item';
import { checkNetworkDuplicates } from './check-network-duplicates';
import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

export const validate = async (
  depositData: DepositData[],
  chainId: CSM_SUPPORTED_CHAINS,
  wc: string,
  keysUploadLimit: number,
  blockNumber?: number,
) => {
  try {
    depositData.forEach((data) => checkItem(data, chainId, wc));
    checkLength(depositData, keysUploadLimit);
    checkDuplicates(depositData);
    checkPreviouslySubmittedDuplicates(depositData, chainId, blockNumber);
    await checkNetworkDuplicates(depositData);

    return null;
  } catch (error) {
    return error as Error;
  }
};
