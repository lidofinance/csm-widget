import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId, BondBalance } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

export const KEY_OPERATOR_BALANCE = ['operator-balance'];

export const useOperatorBalance = <TData = BondBalance>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: BondBalance) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_BALANCE, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.operator.getBondBalance(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
