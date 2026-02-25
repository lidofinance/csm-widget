import { NodeOperatorId, PenaltyRecord } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useOperatorPenalties = <TData = PenaltyRecord[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: PenaltyRecord[]) => TData,
) => {
  const { events } = useSmSDK();

  return useQuery({
    queryKey: ['operator-penalties', { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return events.getPenalties(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
