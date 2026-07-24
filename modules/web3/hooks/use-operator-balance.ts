import { BondBalance, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_BALANCE = ['operator-balance'];

export const useOperatorBalance = <TData = BondBalance>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: BondBalance) => TData,
) => {
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_BALANCE, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return operator.getBondBalance(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
