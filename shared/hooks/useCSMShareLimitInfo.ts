import { useContractSWR } from '@lido-sdk/react';
import { BigNumber } from 'ethers';
import invariant from 'tiny-invariant';

import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { StakingRouter } from 'generated';
import { useCsmConstants } from './use-csm-constants';
import { useStakingRouterRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

const PERCENT_BASIS = 10_000;

const SHARE_LIMIT_THRESHOLD = 200;

export const SHARE_LIMIT_STATUS = {
  FAR: 'FAR',
  APPROACHING: 'APPROACHING',
  EXHAUSTED: 'EXHAUSTED',
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

  const capacity = totalActive
    .mul(moduleDigest.state.stakeShareLimit)
    .div(PERCENT_BASIS);

  const activeLeft = capacity.sub(active);

  const status: SHARE_LIMIT_STATUS = activeLeft.lte(0)
    ? SHARE_LIMIT_STATUS.REACHED
    : activeLeft.sub(queue).lt(0)
      ? SHARE_LIMIT_STATUS.EXHAUSTED
      : activeLeft.sub(queue).lt(SHARE_LIMIT_THRESHOLD)
        ? SHARE_LIMIT_STATUS.APPROACHING
        : SHARE_LIMIT_STATUS.FAR;

  return {
    active,
    activeLeft,
    capacity,
    queue,
    status,
  };
};

export const useCSMShareLimitInfo = (config = STRATEGY_CONSTANT) => {
  const { stakingModuleId } = useCsmConstants();

  const modulesSwr = useContractSWR({
    contract: useStakingRouterRPC(),
    method: 'getAllStakingModuleDigests',
    config,
  });

  return useMergeSwr([modulesSwr], getInfo(modulesSwr.data, stakingModuleId));
};
