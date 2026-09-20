import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

/** True if the address holds the role on any deployed module. */
export const useHasReportDelayedPenaltyRole = () => {
  const { address } = useDappStatus();
  const { sm } = useLidoSDK();

  return useQuery({
    queryKey: [
      'has-report-delayed-penalty-role',
      { address, modules: Object.keys(sm) },
    ],
    ...STRATEGY_IMMUTABLE,
    queryFn: async () => {
      invariant(address);
      // one module's RPC failure must not hide a role granted on another
      const results = await Promise.allSettled(
        Object.values(sm).map((sdk) =>
          sdk
            ? sdk.module.hasProtocolRole(
                'REPORT_GENERAL_DELAYED_PENALTY_ROLE',
                address,
              )
            : Promise.resolve(false),
        ),
      );
      return results.some((r) => r.status === 'fulfilled' && r.value);
    },
    enabled: !!address,
  });
};
