import { useContractSWR } from '@lido-sdk/react';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';

import { getCsmConstants } from 'consts/csm-constants';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { StakingRouter } from 'generated';
import { useStakingRouterRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

const PERCENT_BASIS = 10_000;

const SHARE_LIMIT_THRESHOLD = 200;

export const SHARE_LIMIT_STATUS = {
  FAR: 'FAR',
  APPROACHING: 'APPROACHING',
  REACHED: 'REACHED',
} as const;
export type SHARE_LIMIT_STATUS = keyof typeof SHARE_LIMIT_STATUS;
export type ShareLimitInfo = ReturnType<typeof getInfo>;

const getInfo = (
  digest: StakingRouter.StakingModuleDigestStructOutput[] | undefined,
  moduleId: number,
) => {
  if (!digest) return undefined;

  const moduleDigest = digest.find((m) => m.state.id === moduleId);
  invariant(moduleDigest, `Module [${moduleId}] not found`);

  const active = moduleDigest.summary.totalDepositedValidators.sub(
    moduleDigest.summary.totalExitedValidators,
  );
  const queue = moduleDigest.summary.depositableValidatorsCount;

  const totalActive = digest.reduce(
    (s, m) =>
      s.add(
        m.summary.totalDepositedValidators.sub(m.summary.totalExitedValidators),
      ),
    BigNumber.from(0),
  );

  const activeLeft = totalActive
    .mul(moduleDigest.state.stakeShareLimit)
    .div(PERCENT_BASIS)
    .sub(active);

  const status: SHARE_LIMIT_STATUS = activeLeft.lte(0)
    ? SHARE_LIMIT_STATUS.REACHED
    : activeLeft.sub(queue).lt(SHARE_LIMIT_THRESHOLD)
      ? SHARE_LIMIT_STATUS.APPROACHING
      : SHARE_LIMIT_STATUS.FAR;

  return {
    totalActive,
    activeLeft,
    queue,
    status,
  };
};

export const useCSMShareLimitInfo = (config = STRATEGY_CONSTANT) => {
  const { stakingModuleId } = getCsmConstants();

  const modulesSwr = useContractSWR({
    contract: useStakingRouterRPC(),
    method: 'getAllStakingModuleDigests',
    config,
  });

  return useMergeSwr(
    [modulesSwr],
    useMemo(
      () => getInfo(modulesSwr.data, stakingModuleId),
      [modulesSwr.data, stakingModuleId],
    ),
  );
};
