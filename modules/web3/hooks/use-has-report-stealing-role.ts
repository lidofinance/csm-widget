import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const useHasReportStealingRole = () => {
  const { address } = useDappStatus();
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['has-report-stealing-role', { address }],
    ...STRATEGY_IMMUTABLE,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => csm.module.hasReportStealingRole(address!),
    enabled: !!address,
  });
};
