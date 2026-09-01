import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { fetchAcrossModules } from '../fetch-across-modules';
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
      return fetchAcrossModules(sm, 'invite discovery', (sdk) =>
        sdk.discovery.getNodeOperatorsByProposedAddress(address),
      ) as Promise<ModuleInvite[]>;
    },
    enabled: !!address,
  });
};
