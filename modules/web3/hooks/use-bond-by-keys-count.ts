import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import invariant from 'tiny-invariant';

type Props = {
  keysCount: bigint;
  curveId?: bigint;
  token?: TOKENS;
};

export const useBondByKeysCount = ({
  keysCount = 0n,
  curveId,
  token = TOKENS.steth,
}: Props) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getBondAmountByKeysCountPerToken', { keysCount, curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId);
      return csm.accounting.getBondAmountByKeysCountPerToken({
        keysCount,
        curveId,
      });
    },
    enabled: keysCount > 0n && curveId !== undefined,
    select: (data) => data[token],
  });
};
