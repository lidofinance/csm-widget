import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

type Props = {
  curveId: bigint | undefined;
  keysCount?: number;
  token?: TOKENS;
};

export const useBondByKeysCount = ({
  keysCount = 0,
  curveId,
  token = TOKENS.steth,
}: Props) => {
  const { accounting } = useSmSDK();

  return useQuery({
    queryKey: ['getBondAmountByKeysCountPerToken', { keysCount, curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return accounting.getBondAmountByKeysCountPerToken({
        keysCount: BigInt(keysCount),
        curveId,
      });
    },
    enabled: curveId !== undefined,
    select: (data) => data[token],
  });
};
