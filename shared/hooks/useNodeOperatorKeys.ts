import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { splitHex } from 'shared/keys';
import { PUBKEY_LENGTH } from 'shared/keys/validate/constants';
import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export const useNodeOperatorKeys = (
  nodeOperatorId?: NodeOperatorId,
  startIndex = 0,
  count = 0,
  config = STRATEGY_CONSTANT,
) => {
  const keysSwr = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getSigningKeys',
    params: [nodeOperatorId, startIndex, count],
    shouldFetch: Boolean(nodeOperatorId),
    config,
  });

  const keys = useMemo(() => {
    return keysSwr.data
      ? splitHex(keysSwr.data, PUBKEY_LENGTH).map((key, index) => ({
          key,
          index: index + startIndex,
        }))
      : undefined;
  }, [keysSwr.data, startIndex]);

  return useMergeSwr([keysSwr], keys);
};
