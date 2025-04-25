import { CHAINS, KEYS_UPLOAD_TX_LIMIT } from 'consts';
import { getCsmConstants } from 'consts/csm-constants';
import { validate } from 'shared/keys';
import invariant from 'tiny-invariant';
import type { DepositData } from 'types';
import { ValidationError } from './validation-error';

type ValidateDepositDataProps = {
  depositData: DepositData[];
  chainId?: CHAINS;
  blockNumber?: number;
};

export const validateDepositData = async ({
  depositData,
  chainId,
  blockNumber,
}: ValidateDepositDataProps) => {
  const wc = getCsmConstants(chainId).withdrawalCredentials;
  invariant(chainId, 'chainId is not specified');
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
