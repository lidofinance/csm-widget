import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useCSModuleRPC } from './useCsmContracts';

export const useReportStealingRoleAddress = (
  curveId?: BigNumber,
  config = STRATEGY_CONSTANT,
) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'REPORT_EL_REWARDS_STEALING_PENALTY_ROLE',
    params: [],
    config,
  });
};
