import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { config } from 'config';
import { STRATEGY_CONSTANT } from 'consts';
import { useDappStatus, useSmSDKByModule } from 'modules/web3';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useOtherModule = (customAddress?: Address) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  // Pin to the static deploy module: this runs on /create where there is no
  // active operator, so "the other module" must be relative to the deploy
  // module, not the (absent) active one.
  const { module, core } = useSmSDKByModule(config.module as MODULE_NAME);

  return useQuery({
    queryKey: ['other-module', { address, module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      return module.getUsedOtherModule(address);
    },
    enabled: !!address,
  });
};
