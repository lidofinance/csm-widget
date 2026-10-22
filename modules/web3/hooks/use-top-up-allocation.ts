import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT, STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useActiveSmSDK, useSmSDK } from '../web3-provider';

export const KEY_TOP_UP_ALLOCATION = ['top-up-allocation'];
export const KEY_TOP_UP_ALLOCATION_SUPPORTED = ['top-up-allocation-supported'];

export const useTopUpAllocationEnabled = ({
  nodeOperatorId,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
}) => {
  const sdk = useActiveSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [
      ...KEY_TOP_UP_ALLOCATION,
      { nodeOperatorId, module: MODULE_NAME.CM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      invariant(sdk);
      return await sdk.metaRegistry.isTopUpAllocationEnabled(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined && !!sdk,
  });
};

export const useIsTopUpAllocationSupported = () => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  return useQuery({
    queryKey: [...KEY_TOP_UP_ALLOCATION_SUPPORTED, { module: MODULE_NAME.CM }],
    ...STRATEGY_IMMUTABLE,
    queryFn: async () => {
      invariant(sdk);
      return (await sdk.module.getModuleVersion()) >= 2n;
    },
    enabled: !!sdk,
  });
};
