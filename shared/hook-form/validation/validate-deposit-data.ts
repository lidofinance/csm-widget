import { CHAINS } from '@lido-sdk/constants';
import { getCsmConstants } from 'consts/csm-constants';
import { validate } from 'shared/keys';
import invariant from 'tiny-invariant';
import type { DepositData } from 'types';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  chainId?: CHAINS;
  keysUploadLimit?: number;
};

// TODO: pass currentBlock
export const validateDepositData = async ({
  depositData,
  chainId,
  keysUploadLimit,
}: ValidateDepositDataProps) => {
  const wc = getCsmConstants(chainId).withdrawalCredentials;
  invariant(chainId, 'chainId is not specified');
  invariant(wc, 'WC is not specified');
  invariant(keysUploadLimit !== undefined, 'keysUploadLimit is not specified');
  const error = await validate(depositData, chainId, wc, keysUploadLimit);
  if (error) {
    throw new ValidationError('depositData', error.message);
  }
};
