import { NodeOperatorId, ValidatorInfoIssues } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';

export const KEY_FEE_RECIPIENT_ISSUES = ['fee-recipient-issues'];

export const useOperatorKeysWithIssues = <TData = ValidatorInfoIssues[]>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: ValidatorInfoIssues[]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_FEE_RECIPIENT_ISSUES, { nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return csm.feesMonitoring.getKeysWithIssues(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
