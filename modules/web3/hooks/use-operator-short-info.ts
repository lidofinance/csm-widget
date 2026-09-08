import {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { config } from 'config';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { KEY_OPERATOR_INFO } from './use-operator-info';

export const useOperatorShortInfo = <TData = NodeOperatorShortInfo>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorShortInfo) => TData,
  module?: MODULE_NAME,
) => {
  const targetModule = module ?? config.module;
  const sdk = useSmSDK(targetModule);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_INFO,
      'short',
      { nodeOperatorId, module: targetModule },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined && sdk);
      return await sdk.operator.getManagementProperties(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined && !!sdk,
    select,
  });
};
