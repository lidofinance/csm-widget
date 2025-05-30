import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk/common';
import invariant from 'tiny-invariant';

type Props = {
  keysCount: bigint;
  nodeOperatorId?: NodeOperatorId;
  token: TOKENS;
};

export const useBondNextKeysCount = ({
  keysCount = 0n,
  nodeOperatorId,
  token,
}: Props) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getBondForNextKeysPerToken', { keysCount, nodeOperatorId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(nodeOperatorId);
      return csm.accounting.getBondForNextKeysPerToken({
        keysCount,
        nodeOperatorId,
      });
    },
    enabled: keysCount > 0n && nodeOperatorId !== undefined,
    select: (data) => data[token],
  });
};
