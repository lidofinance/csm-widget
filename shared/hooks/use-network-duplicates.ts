import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { HexString } from 'shared/keys';
import { useAccount } from './use-account';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import invariant from 'tiny-invariant';
import { getCSMContractAddress } from 'consts/csm-contracts';

// FIXME: mainnet
const KAPI_URL = 'https://keys-api-holesky.testnet.fi';
const MODULE_ID = 4;

type NetworkKey = {
  index: number;
  key: HexString;
  depositSignature: HexString;
  operatorIndex: number;
  used: boolean;
  moduleAddress: string;
};

type ReturnedKeys = {
  data: {
    keys: NetworkKey[];
    module: any;
  };
  meta: any;
};

type FoundedKeys = {
  data: NetworkKey[];
  meta: any;
};

const getKeys = async (id: string) => {
  const response = await fetch(
    `${KAPI_URL}/v1/modules/${MODULE_ID}/keys?operatorIndex=${id}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        origin: 'csm.testnet.fi', // TODO: remove
      },
    },
  );

  const json: ReturnedKeys = await response.json();

  return json.data.keys;
};

const findKeys = async (pubkeys: HexString[]) => {
  const response = await fetch(`${KAPI_URL}/v1/keys/find`, {
    method: 'post',
    body: JSON.stringify({ pubkeys }),
    headers: {
      'Content-Type': 'application/json',
      origin: 'csm.testnet.fi', // TODO: remove
    },
  });

  const json: FoundedKeys = await response.json();

  return json.data;
};

const getDuplicates = (
  keys: NetworkKey[],
  nodeOperatorId: string,
  moduleAddress: string,
): HexString[] => {
  const dups: HexString[] = keys.map(({ key }) => key).filter(duplicates);

  keys.forEach((key) => {
    if (
      `${key.operatorIndex}` !== nodeOperatorId ||
      key.moduleAddress !== moduleAddress
    ) {
      dups.push(key.key);
    }
  });

  return dups.filter(onlyUnique);
};

// TODO: refactor check-network-duplicates.ts
export const useNetworkDuplicates = (config = STRATEGY_LAZY) => {
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  invariant(nodeOperatorId);

  return useLidoSWR(
    ['no-keys', nodeOperatorId, chainId],
    async () => {
      const csmAddress = getCSMContractAddress(chainId, 'CSModule');
      const keys = await getKeys(nodeOperatorId);
      const rawKeys = await findKeys(
        keys.map(({ key }) => key).filter(onlyUnique),
      );
      return getDuplicates(rawKeys, nodeOperatorId, csmAddress);
    },
    config,
  );
};

const onlyUnique = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) === index;
};

const duplicates = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) !== index;
};
