import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useDappStatus, useSmSDKByModule } from 'modules/web3';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const useOtherModule = (customAddress?: Address) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  // Runs on /create where there is no active operator. MVP: /create is the
  // CSM path, so "the other module" is relative to CSM.
  const { module, core } = useSmSDKByModule(MODULE_NAME.CSM);

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
