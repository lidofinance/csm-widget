import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import invariant from 'tiny-invariant';

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
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getBondAmountByKeysCountPerToken', { keysCount, curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined);
      return csm.accounting.getBondAmountByKeysCountPerToken({
        keysCount: BigInt(keysCount),
        curveId,
      });
    },
    enabled: curveId !== undefined,
    select: (data) => data[token],
  });
};
