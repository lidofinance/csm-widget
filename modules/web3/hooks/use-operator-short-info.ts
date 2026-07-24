import {
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { KEY_OPERATOR_INFO } from './use-operator-info';

export const useOperatorShortInfo = <TData = NodeOperatorShortInfo>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorShortInfo) => TData,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_INFO, 'short', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getManagementProperties(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
