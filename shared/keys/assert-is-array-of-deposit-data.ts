import { CHAINS } from '@lido-sdk/constants';
import { trimAddress } from '@lidofinance/address';
import { DepositData } from 'types';
import { compareLowercase } from 'utils';
import {
  FIXED_AMOUNT,
  FIXED_FORK_VERSION,
  FIXED_NETWORK,
  FIXED_WC_PREFIX,
  PUBKEY_LENGTH,
  SIGNATURE_LENGTH,
} from './constants';
import { isHexadecimalString, trimOx } from './utils';

const TRIM_LENGTH = 6;

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

export const assertIsArrayOfDepositData: (
  depositData: unknown,
  chainId?: CHAINS,
  wc?: string,
) => asserts depositData is DepositData[] = (depositData, chainId, wc) => {
  if (!Array.isArray(depositData)) {
    throw new Error('it should be an array');
  }

  depositData.forEach((signingKey) => {
    if (typeof signingKey !== 'object') {
      throw new Error('array should have are objects');
    }

    assertPubkey(signingKey.pubkey);

    assertSignature(signingKey.signature);

    if (typeof signingKey.deposit_message_root !== 'string') {
      throw new Error(`deposit_message_root is not a string`);
    }

    if (typeof signingKey.deposit_data_root !== 'string') {
      throw new Error(`deposit_data_root is not a string`);
    }

    if (typeof signingKey.withdrawal_credentials !== 'string') {
      throw new Error('withdrawal_credentials is not a string');
    }

    if (signingKey.amount !== FIXED_AMOUNT) {
      throw new Error('amount is not equal to 32');
    }

    if (chainId) {
      const networkNames = FIXED_NETWORK[chainId];
      if (
        !networkNames?.includes(
          signingKey.network_name || signingKey.eth2_network_name,
        )
      ) {
        const networks = networkNames?.join(', ');

        throw new Error(
          `network_name or eth2_network_name is not equal to ${networks}`,
        );
      }

      const forkVersion = FIXED_FORK_VERSION[chainId];
      if (signingKey.fork_version !== forkVersion) {
        throw new Error(`fork_version is not equal to ${forkVersion}`);
      }
    }

    if (
      wc &&
      !compareLowercase(
        signingKey.withdrawal_credentials,
        `${FIXED_WC_PREFIX}${trimOx(wc)}`,
      ) &&
      !compareLowercase(signingKey.withdrawal_credentials, `${trimOx(wc)}`)
    ) {
      throw new Error(`withdrawal_credentials is not equal to ${wc}`);
    }
  });
};
