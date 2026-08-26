import { MODULE_NAME, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK, useSmSDKByModule } from '../web3-provider';

type Props = {
  curveId: bigint | undefined;
  keysCount?: number;
  token?: TOKENS;
  module?: MODULE_NAME;
};

export const useBondByKeysCount = ({
  keysCount = 0,
  curveId,
  token = TOKENS.steth,
  module,
}: Props) => {
  const activeSdk = useSmSDK();
  const targetModule = module ?? activeSdk.core.moduleName;
  const byModuleSdk = useSmSDKByModule(targetModule);
  const sdk = module ? byModuleSdk : activeSdk;

  return useQuery({
    queryKey: [
      'getBondAmountByKeysCountPerToken',
      { keysCount, curveId, module: targetModule },
    ],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(curveId !== undefined && sdk);
      return sdk.accounting.getBondAmountByKeysCountPerToken({
        keysCount: BigInt(keysCount),
        curveId,
      });
    },
    enabled: curveId !== undefined && !!sdk,
    select: (data) => data[token],
  });
};
