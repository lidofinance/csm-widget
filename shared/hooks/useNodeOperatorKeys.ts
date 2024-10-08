import { useContractSWR } from '@lido-sdk/react';
import { useMemo } from 'react';
import { splitHex } from 'shared/keys';
import { PUBKEY_LENGTH } from 'shared/keys/validate/constants';
import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';

// TODO: load by chunks
// const MAX_KEYS_COUNT = 10;

export const useNodeOperatorKeys = (
  nodeOperatorId?: NodeOperatorId,
  nonDepositedOnly = false,
  maxLengh = 0,
  config = STRATEGY_CONSTANT,
) => {
  const { data } = useNodeOperatorInfo(nodeOperatorId);

  const [startIndex, keysCount] = useMemo(() => {
    const startIndex = (nonDepositedOnly && data?.totalDepositedKeys) || 0;
    const count = (data?.totalAddedKeys ?? 0) - startIndex;
    return [startIndex, maxLengh ? Math.min(count, maxLengh) : count];
  }, [
    data?.totalAddedKeys,
    data?.totalDepositedKeys,
    maxLengh,
    nonDepositedOnly,
  ]);

  const swr = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getSigningKeys',
    params: [nodeOperatorId, startIndex, keysCount],
    shouldFetch: Boolean(nodeOperatorId && keysCount),
    config,
  });

  const keys = useMemo(() => {
    return swr.data ? splitHex(swr.data, PUBKEY_LENGTH) : undefined;
  }, [swr.data]);

  return { ...swr, data: keys };
};
