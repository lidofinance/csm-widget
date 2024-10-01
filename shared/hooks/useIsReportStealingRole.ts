import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useAccount } from 'wagmi';
import { useCSModuleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export const useIsReportStealingRole = () => {
  const { address } = useAccount();

  const swrReportRole = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'REPORT_EL_REWARDS_STEALING_PENALTY_ROLE',
    config: STRATEGY_CONSTANT,
  });

  const swrHasRole = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'hasRole',
    params: [swrReportRole.data, address],
    config: STRATEGY_CONSTANT,
  });

  return useMergeSwr([swrReportRole, swrHasRole], swrHasRole.data);
};
