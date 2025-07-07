import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';
import invariant from 'tiny-invariant';

export const useHasReportStealingRole = () => {
  const { address } = useDappStatus();
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['has-report-stealing-role', { address }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(address);
      return csm.stealing.hasReportRole(address);
    },
    enabled: !!address,
  });
};
