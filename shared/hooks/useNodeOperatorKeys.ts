import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { useMemo } from 'react';
import { PUBKEY_LENGTH, splitHex } from 'shared/keys';

export const useNodeOperatorKeys = (
  nodeOperatorId?: NodeOperatorId,
  nonDepositedOnly = false,
) => {
  const { data } = useNodeOperatorInfo(nodeOperatorId);

  const [startIndex, keysCount] = useMemo(() => {
    const startIndex = (nonDepositedOnly && data?.totalDepositedKeys) || 0;
    return [startIndex, data?.totalAddedKeys.sub(startIndex)];
  }, [data?.totalAddedKeys, data?.totalDepositedKeys, nonDepositedOnly]);

  // TODO: split to chunks
  const swr = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getSigningKeys',
    params: [nodeOperatorId, startIndex, keysCount],
    shouldFetch: Boolean(nodeOperatorId && keysCount),
  });

  const keys = useMemo(() => {
    return swr.data ? splitHex(swr.data, PUBKEY_LENGTH) : undefined;
  }, [swr.data]);

  return { ...swr, data: keys };
};
