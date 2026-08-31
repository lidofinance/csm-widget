import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT, deployedModules } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import { mergeInvites } from './merge-invites';
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
      // Queried per module so one module's RPC failure cannot hide the others'
      // invites; only a total failure surfaces as a query error.
      const entries = deployedModules.flatMap((module) => {
        const sdk = sm[module];
        return sdk ? [{ module, sdk }] : [];
      });
      const settled = await Promise.allSettled(
        entries.map(({ sdk }) =>
          sdk.discovery.getNodeOperatorsByProposedAddress(address),
        ),
      );

      if (
        settled.length > 0 &&
        settled.every((result) => result.status === 'rejected')
      ) {
        throw settled[0].reason;
      }

      const results = entries.map(({ module }, index) => {
        const result = settled[index];
        if (result.status === 'rejected') {
          console.warn(`${module} invite discovery failed`, result.reason);
          return { module, invites: [] };
        }
        return { module, invites: result.value };
      });

      return mergeInvites(results);
    },
    enabled: !!address,
  });
};
