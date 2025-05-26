/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

type Props = {
  keysCount: bigint;
  curveId?: bigint;
  token: TOKENS;
};

export const useBondByKeysCount = ({
  keysCount = 0n,
  curveId,
  token,
}: Props) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['getBondAmountByKeysCountPerToken', { keysCount, curveId }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () =>
      csm.accounting.getBondAmountByKeysCountPerToken(keysCount, curveId!),
    enabled: keysCount > 0n && curveId !== undefined,
    select: (data) => data[token],
  });
};
