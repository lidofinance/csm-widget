import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { ModuleInvite } from './types';
import { Address } from 'viem';

export const KEY_INVITES = ['invites'];

export const useInvites = (customAddress?: Address) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const { sm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_INVITES, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      const refs = await sm.discovery.getNodeOperatorsByProposedAddress(
        address,
        {
          onModuleError: (module, error) =>
            console.warn(`${module} invite discovery failed`, error),
        },
      );
      return refs.map(({ module, invite }): ModuleInvite => ({
        ...invite,
        module,
      }));
    },
    enabled: !!address,
  });
};
