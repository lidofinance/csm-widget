import { CHAINS } from '@lido-sdk/constants';
import { getCsmConstants } from 'consts/csm-constants';
import { validate } from 'shared/keys';
import invariant from 'tiny-invariant';
import type { DepositData } from 'types';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  chainId?: CHAINS;
};

// TODO: pass currentBlock
export const validateDepositData = async ({
  depositData,
  chainId,
}: ValidateDepositDataProps) => {
  const wc = getCsmConstants(chainId).withdrawalCredentials;
  invariant(chainId);
  invariant(wc);
  const error = await validate(depositData, chainId, wc);
  if (error) {
    throw new ValidationError('depositData', error.message);
  }
};
