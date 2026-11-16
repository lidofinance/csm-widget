import {
  MODULE_NAME,
  NodeOperatorId,
  OperatorMetadata,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';

import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_METADATA = ['operator-metadata'];

export const useOperatorMetadata = <TData = OperatorMetadata>({
  nodeOperatorId,
  module,
  select,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
  module: MODULE_NAME | undefined;
  select?: (data: OperatorMetadata) => TData;
}) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_METADATA,
      // keyed by the requested module: a disabled non-CM query must not read CM cache
      { nodeOperatorId, module },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      invariant(sdk);
      return await sdk.metaRegistry.getOperatorInfo(nodeOperatorId);
    },
    enabled: module === MODULE_NAME.CM && nodeOperatorId !== undefined && !!sdk,
    select,
  });
};
