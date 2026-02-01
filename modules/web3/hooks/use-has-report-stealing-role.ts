import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const useHasReportStealingRole = () => {
  const { address } = useDappStatus();
  const { stealing } = useSmSDK();

  return useQuery({
    queryKey: ['has-report-stealing-role', { address }],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(address);
      return stealing.hasReportRole(address);
    },
    enabled: !!address,
  });
};
