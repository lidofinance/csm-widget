import { BigNumber } from 'ethers';
import { useLidoSWR } from '@lido-sdk/react';

import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useAccount } from './use-account';
import { useSTETHContractRPC } from './useLidoContracts';

const getMaxStakeAmount = (limitInfo: {
  isStakingPaused: boolean;
  isStakingLimitSet: boolean;
  currentStakeLimit: BigNumber;
}) => {
  if (limitInfo.isStakingPaused) return BigNumber.from(0);
  if (limitInfo.isStakingLimitSet) return limitInfo.currentStakeLimit;
  return null;
};

// TODO: rename
export const useStakingLimitInfo = () => {
  const { chainId } = useAccount();
  const steth = useSTETHContractRPC();

  return useLidoSWR(
    ['swr:getStakeLimitFullInfo', chainId, steth],
    async () => {
      const stakeLimitFullInfo = await steth.getStakeLimitFullInfo();

      return getMaxStakeAmount(stakeLimitFullInfo);
    },
    {
      ...STRATEGY_LAZY,
      refreshInterval: 60000,
    },
  );
};
