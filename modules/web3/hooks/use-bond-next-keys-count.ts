import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

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
  const { accounting } = useSmSDK();

  return useQuery({
    queryKey: ['getBondForNextKeysPerToken', { keysCount, nodeOperatorId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(nodeOperatorId !== undefined);
      return accounting.getBondForNextKeysPerToken({
        keysCount: BigInt(keysCount),
        nodeOperatorId,
      });
    },
    enabled: keysCount > 0 && nodeOperatorId !== undefined,
    select: (data) => data[token],
  });
};
