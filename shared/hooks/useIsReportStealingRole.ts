import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { compareLowercase } from 'utils';
import { useAccount } from 'wagmi';
import { useCSModuleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export const useIsReportStealingRole = () => {
  const { address } = useAccount();

  const swrAddress = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'REPORT_EL_REWARDS_STEALING_PENALTY_ROLE',
    params: [],
    config: STRATEGY_CONSTANT,
  });

  const isRole = useMemo(() => {
    return swrAddress.data
      ? compareLowercase(swrAddress.data, address)
      : undefined;
  }, [address, swrAddress.data]);

  return useMergeSwr([swrAddress], isRole);
};
