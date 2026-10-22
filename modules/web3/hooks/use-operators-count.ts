import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useTargetSmSDK } from '../web3-provider';

export const useOperatorsCount = (module?: MODULE_NAME) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['operators-count', { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.module.getOperatorsCount();
    },
    enabled: !!sdk,
  });
};
