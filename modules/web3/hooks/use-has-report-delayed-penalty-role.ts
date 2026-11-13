import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

/** Modules where the address holds the delayed-penalty report role. */
export const useHasReportDelayedPenaltyRole = () => {
  const { address } = useDappStatus();
  const { sm } = useLidoSDK();

  return useQuery({
    queryKey: [
      'has-report-delayed-penalty-role',
      { address, modules: sm.moduleNames },
    ],
    ...STRATEGY_IMMUTABLE,
    queryFn: async (): Promise<MODULE_NAME[]> => {
      invariant(address);
      const entries = [...sm.modules];
      // one module's RPC failure must not hide a role granted on another
      const results = await Promise.allSettled(
        entries.map(([, sdk]) =>
          sdk.module.hasProtocolRole(
            'REPORT_GENERAL_DELAYED_PENALTY_ROLE',
            address,
          ),
        ),
      );
      return entries
        .filter(
          (_, index) =>
            results[index].status === 'fulfilled' && results[index].value,
        )
        .map(([module]) => module);
    },
    enabled: !!address,
  });
};
