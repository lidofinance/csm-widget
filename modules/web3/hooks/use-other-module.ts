import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useDappStatus, useTargetSmSDK } from 'modules/web3';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useOtherModule = (
  customAddress?: Address,
  module?: MODULE_NAME,
) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['other-module', { address, module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address && sdk);
      return sdk.module.getUsedOtherModule(address);
    },
    enabled: !!address && !!sdk,
  });
};
