import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants, getCsmContractAddress } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { HexString } from 'shared/keys';
import invariant from 'tiny-invariant';
import { useAccount } from './use-account';

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

const getKeys = async (keysApiUrl: string, moduleId: number, id: string) => {
  const response = await fetch(
    `${keysApiUrl}/v1/modules/${moduleId}/keys?operatorIndex=${id}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const json: ReturnedKeys = await response.json();

  return json.data.keys;
};

const findKeys = async (keysApiUrl: string, pubkeys: HexString[]) => {
  const response = await fetch(`${keysApiUrl}/v1/keys/find`, {
    method: 'post',
    body: JSON.stringify({ pubkeys }),
    headers: {
      'Content-Type': 'application/json',
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

// FIXME: refactor check-network-duplicates.ts
export const useNetworkDuplicates = (config = STRATEGY_LAZY) => {
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const { keysApi } = getExternalLinks(chainId);
  const csmAddress = getCsmContractAddress(chainId, 'CSModule');

  return useLidoSWR(
    ['no-keys', nodeOperatorId, chainId],
    useCallback(async () => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      const moduleId = getCsmConstants(chainId).stakingModuleId;
      const keys = await getKeys(keysApi, moduleId, nodeOperatorId);
      const rawKeys = await findKeys(
        keysApi,
        keys.map(({ key }) => key).filter(onlyUnique),
      );
      return getDuplicates(rawKeys, nodeOperatorId, csmAddress);
    }, [chainId, csmAddress, keysApi, nodeOperatorId]),
    config,
  );
};

const onlyUnique = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) === index;
};

const duplicates = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) !== index;
};
