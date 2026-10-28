import { MODULE_NAME, ProtocolRole } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useTargetSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const useHasProtocolRole = (
  role: ProtocolRole,
  module?: MODULE_NAME,
) => {
  const { address } = useDappStatus();
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['has-protocol-role', { role, address, module: targetModule }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(address);
      invariant(sdk);
      return sdk.module.hasProtocolRole(role, address);
    },
    enabled: !!address && !!sdk,
  });
};
