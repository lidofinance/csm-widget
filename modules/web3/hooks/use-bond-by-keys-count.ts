import { CurveRef, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';

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
  const sdk = useSmSDKByModule(curve?.module);

  return useQuery({
    queryKey: [
      'getBondAmountByKeysCountPerToken',
      { keysCount, curveId: curve?.curveId, module: curve?.module },
    ],
    ...STRATEGY_IMMUTABLE,
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
