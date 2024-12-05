import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { splitHex } from 'shared/keys';
import { PUBKEY_LENGTH } from 'shared/keys/validate/constants';
import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';

// TODO: load by chunks
export const useNodeOperatorKeys = (
  nodeOperatorId?: NodeOperatorId,
  nonDepositedOnly = false,
  maxLengh = 0,
  config = STRATEGY_CONSTANT,
) => {
  const infoSwr = useNodeOperatorInfo(nodeOperatorId);

  const [startIndex, keysCount] = useMemo(() => {
    const startIndex =
      (nonDepositedOnly && infoSwr.data?.totalDepositedKeys) || 0;
    const count = (infoSwr.data?.totalAddedKeys ?? 0) - startIndex;
    return [startIndex, maxLengh ? Math.min(count, maxLengh) : count];
  }, [
    infoSwr.data?.totalAddedKeys,
    infoSwr.data?.totalDepositedKeys,
    maxLengh,
    nonDepositedOnly,
  ]);

  const keysSwr = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getSigningKeys',
    params: [nodeOperatorId, startIndex, keysCount],
    shouldFetch: Boolean(nodeOperatorId && keysCount),
    config,
  });

  const keys = useMemo(() => {
    return keysSwr.data ? splitHex(keysSwr.data, PUBKEY_LENGTH) : undefined;
  }, [keysSwr.data]);

  return useMergeSwr([infoSwr, keysSwr], keys);
};
