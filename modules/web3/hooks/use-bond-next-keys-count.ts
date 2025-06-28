import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

type Props = {
  nodeOperatorId: NodeOperatorId | undefined;
  token: TOKENS;
  keysCount?: number;
};

export const useBondNextKeysCount = ({
  nodeOperatorId,
  token,
  keysCount = 0,
}: Props) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getBondForNextKeysPerToken', { keysCount, nodeOperatorId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return csm.accounting.getBondForNextKeysPerToken({
        keysCount: BigInt(keysCount),
        nodeOperatorId,
      });
    },
    enabled: keysCount > 0 && nodeOperatorId !== undefined,
    select: (data) => data[token],
  });
};
