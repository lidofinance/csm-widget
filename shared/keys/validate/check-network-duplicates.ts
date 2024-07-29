import { DepositData } from 'types';
import { TRIM_LENGTH } from './constants';
import { trimAddress } from '@lidofinance/address';
import { trimOx } from '../utils';
import { HexString } from '../types';

const KAPI_URL = 'https://keys-api-holesky.testnet.fi';

type ResponseData = {
  data: {
    index: number;
    key: HexString;
    depositSignature: string;
    operatorIndex: number;
    used: boolean;
    moduleAddress: string;
  }[];
  meta: any;
};

const findDuplicate = async (pubkeys: HexString[]) => {
  try {
    // TODO: timeout
    // TODO: cache
    const response = await fetch(`${KAPI_URL}/v1/keys/find`, {
      method: 'post',
      body: JSON.stringify({ pubkeys }),
      headers: { 'Content-Type': 'application/json', origin: 'csm.testnet.fi' },
    });

    const json: ResponseData = await response.json();

    return json.data.find(({ key }) => pubkeys.includes(key))?.key;
  } catch {
    return;
  }
};

const toHexString = (data: string): HexString => {
  return `0x${data}`;
};

export const checkNetworkDuplicates = async (depositData: DepositData[]) => {
  const pubkeys = depositData.map((data) =>
    toHexString(data.pubkey.toLowerCase()),
  );
  const duplicateKey = await findDuplicate(pubkeys);

  if (duplicateKey) {
    throw new Error(
      `pubkey ${trimAddress(trimOx(duplicateKey), TRIM_LENGTH)} is already deployed`,
    );
  }
};
