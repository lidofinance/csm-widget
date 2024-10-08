import { CHAINS } from '@lido-sdk/constants';
import { trimAddress } from '@lidofinance/address';
import { DepositData, DepositDataV1, DepositDataV2 } from 'types';
import { compareLowercase, isHexadecimalString } from 'utils';
import { trimOx } from '../utils';
import {
  FIXED_AMOUNT,
  FIXED_FORK_VERSION,
  FIXED_NETWORK,
  FIXED_WC_PREFIX,
  PUBKEY_LENGTH,
  SIGNATURE_LENGTH,
  TRIM_LENGTH,
} from './constants';

const assertPubkey = (pubkey: string): void => {
  if (typeof pubkey !== 'string') {
    throw new Error(`pubkey is not a string`);
  }

  if (pubkey.length !== PUBKEY_LENGTH) {
    const trimmed = trimAddress(pubkey, TRIM_LENGTH);
    throw new Error(`pubkey ${trimmed} has wrong length`);
  }

  if (!isHexadecimalString(pubkey)) {
    const trimmed = trimAddress(pubkey, TRIM_LENGTH);
    throw new Error(`pubkey ${trimmed} is not hexadecimal string`);
  }
};

const assertSignature = (signature: string): void => {
  if (typeof signature !== 'string') {
    throw new Error(`signature is not a string`);
  }

  if (signature.length !== SIGNATURE_LENGTH) {
    const trimmed = trimAddress(signature, TRIM_LENGTH);
    throw new Error(`signature ${trimmed} has wrong length`);
  }

  if (!isHexadecimalString(signature)) {
    const trimmed = trimAddress(signature, TRIM_LENGTH);
    throw new Error(`signature ${trimmed} is not hexadecimal string`);
  }
};

export const checkItem = (
  depositData: DepositData,
  chainId: CHAINS,
  wc: string,
) => {
  assertPubkey(depositData.pubkey);

  assertSignature(depositData.signature);

  if (typeof depositData.deposit_message_root !== 'string') {
    throw new Error(`deposit_message_root is not a string`);
  }

  if (typeof depositData.deposit_data_root !== 'string') {
    throw new Error(`deposit_data_root is not a string`);
  }

  if (typeof depositData.withdrawal_credentials !== 'string') {
    throw new Error('withdrawal_credentials is not a string');
  }

  if (depositData.amount !== FIXED_AMOUNT) {
    throw new Error('amount is not equal to 32 eth');
  }

  const networkNames = FIXED_NETWORK[chainId];
  if (
    !networkNames?.includes(
      (depositData as DepositDataV2).network_name ||
        (depositData as DepositDataV1).eth2_network_name,
    )
  ) {
    const networks = networkNames?.join(', ');

    throw new Error(
      `network_name or eth2_network_name is not equal to ${networks}`,
    );
  }

  const forkVersion = FIXED_FORK_VERSION[chainId];
  if (depositData.fork_version !== forkVersion) {
    throw new Error(`fork_version is not equal to ${forkVersion}`);
  }

  if (
    !compareLowercase(
      depositData.withdrawal_credentials,
      `${FIXED_WC_PREFIX}${trimOx(wc)}`,
    ) &&
    !compareLowercase(depositData.withdrawal_credentials, `${trimOx(wc)}`)
  ) {
    throw new Error(`withdrawal_credentials is not equal to ${wc}`);
  }
};
