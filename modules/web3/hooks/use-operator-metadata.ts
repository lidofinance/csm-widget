import {
  MODULE_NAME,
  NodeOperatorId,
  OperatorMetadata,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';

import invariant from 'tiny-invariant';
import { useActiveSmSDK } from '../web3-provider';

export const KEY_OPERATOR_METADATA = ['operator-metadata'];

export const useOperatorMetadata = <TData = OperatorMetadata>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorMetadata) => TData,
) => {
  const sdk = useActiveSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_METADATA,
      { nodeOperatorId, module: MODULE_NAME.CM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      invariant(sdk);
      return await sdk.metaRegistry.getOperatorInfo(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined && !!sdk,
    select,
  });
};
