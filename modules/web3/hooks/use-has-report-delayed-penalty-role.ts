import { useQuery } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const useHasReportDelayedPenaltyRole = () => {
  const { address } = useDappStatus();
  const { delayedPenalty, core } = useSmSDK();

  return useQuery({
    queryKey: [
      'has-report-delayed-penalty-role',
      { address, module: core.moduleName },
    ],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(address);
      return delayedPenalty.hasReportRole(address);
    },
    enabled: !!address,
  });
};
