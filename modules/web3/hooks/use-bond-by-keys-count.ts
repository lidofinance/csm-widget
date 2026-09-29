import { CurveRef, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_BOND_BY_KEYS_COUNT = ['getBondAmountByKeysCountPerToken'];

type Props = {
  curve: CurveRef | undefined;
  keysCount?: number;
  token?: TOKENS;
};

export const useBondByKeysCount = ({
  keysCount = 0,
  curve,
  token = TOKENS.steth,
}: Props) => {
  const sdk = useSmSDK(curve?.module);

  return useQuery({
    queryKey: [
      ...KEY_BOND_BY_KEYS_COUNT,
      { keysCount, curveId: curve?.curveId, module: curve?.module },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(curve && sdk);
      return sdk.accounting.getBondAmountByKeysCountPerToken({
        keysCount: BigInt(keysCount),
        curveId: curve.curveId,
      });
    },
    enabled: !!curve && !!sdk,
    select: (data) => data[token],
  });
};
