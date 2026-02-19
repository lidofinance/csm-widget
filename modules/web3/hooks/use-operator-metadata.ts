import { NodeOperatorId, OperatorMetadata } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { MODULE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_METADATA = ['operator-metadata'];

export const useOperatorMetadata = <TData = OperatorMetadata>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: OperatorMetadata) => TData,
) => {
  const sdk = useSmSDK(MODULE.CM);

  return useQuery({
    queryKey: [...KEY_OPERATOR_METADATA, { nodeOperatorId }],
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
