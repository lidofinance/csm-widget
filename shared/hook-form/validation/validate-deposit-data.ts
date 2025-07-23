import { KEYS_UPLOAD_TX_LIMIT } from 'consts';
import { validate } from 'shared/keys';
import invariant from 'tiny-invariant';
import type { DepositData } from 'types';
import { ValidationError } from './validation-error';
import {
  CSM_CONTRACT_ADDRESSES,
  CSM_SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  chainId?: CSM_SUPPORTED_CHAINS;
  blockNumber?: number;
};

export const validateDepositData = async ({
  depositData,
  chainId,
  blockNumber,
}: ValidateDepositDataProps) => {
  invariant(chainId, 'chainId is not specified');
  const wc = CSM_CONTRACT_ADDRESSES[chainId]?.withdrawalVault;
  invariant(wc, 'WC is not specified');
  const error = await validate(
    depositData,
    chainId,
    wc,
    KEYS_UPLOAD_TX_LIMIT,
    blockNumber,
  );
  if (error) {
    throw new ValidationError('depositData', error.message);
  }
};
