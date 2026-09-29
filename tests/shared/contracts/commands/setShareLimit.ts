import { parseEther } from 'viem';
import {
  MAX_EFFECTIVE_BALANCE_WC_TYPE_01_WEI,
  PERCENT_BASIS,
  WEI_PER_GWEI,
} from '@lidofinance/lido-csm-sdk';
import { BaseModuleAbi, StakingRouterAbi } from '@lidofinance/lido-csm-sdk/abi';
import { ShareLimitStatus, WCType } from '@lidofinance/lido-csm-sdk/module-sdk';
import { stakingRouter } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

const APPROACHING_THRESHOLD = 200n;

export type ShareLimitTarget = Exclude<
  (typeof ShareLimitStatus)[keyof typeof ShareLimitStatus],
  'FAR'
>;

const readDigests = (service: ForkActionsService) =>
  service.client.readContract({
    address: stakingRouter(service.chain),
    abi: StakingRouterAbi,
    functionName: 'getAllStakingModuleDigests',
  });

type Digest = Awaited<ReturnType<typeof readDigests>>[number];

const activeStakeEquivalent = (digest: Digest, stakeWei?: bigint): bigint => {
  const { withdrawalCredentialsType, validatorsBalanceGwei } = digest.state;

  if (withdrawalCredentialsType !== WCType.TYPE_02) {
    const exited =
      digest.summary.totalExitedValidators > digest.state.exitedValidatorsCount
        ? digest.summary.totalExitedValidators
        : digest.state.exitedValidatorsCount;
    return digest.summary.totalDepositedValidators - exited;
  }

  const stake = stakeWei ?? validatorsBalanceGwei * WEI_PER_GWEI;
  return (
    (stake + MAX_EFFECTIVE_BALANCE_WC_TYPE_01_WEI - 1n) /
    MAX_EFFECTIVE_BALANCE_WC_TYPE_01_WEI
  );
};

const statusOf = (activeLeft: bigint, queue: bigint) =>
  activeLeft <= 0n
    ? ShareLimitStatus.REACHED
    : activeLeft - queue < 0n
      ? ShareLimitStatus.EXHAUSTED
      : activeLeft - queue < APPROACHING_THRESHOLD
        ? ShareLimitStatus.APPROACHING
        : ShareLimitStatus.FAR;

export const setShareLimit = async function (
  this: ForkActionsService,
  target: ShareLimitTarget,
): Promise<void> {
  await this.step(`[Contract] Set share limit status "${target}"`, async () => {
    const router = stakingRouter(this.chain);

    const [digests, totalStake] = await this.step('Read modules state', () =>
      Promise.all([
        readDigests(this),
        this.client.readContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'getTotalModuleStake',
        }),
      ]),
    );

    const own = digests.find(
      (digest) =>
        digest.state.stakingModuleAddress.toLowerCase() ===
        this.addresses.module.toLowerCase(),
    );
    if (!own) {
      throw new Error(
        `Module ${this.addresses.module} is not registered in StakingRouter`,
      );
    }

    const active = activeStakeEquivalent(own, totalStake);
    const base = digests.reduce(
      (acc, digest) =>
        acc +
        activeStakeEquivalent(digest, digest === own ? totalStake : undefined),
      0n,
    );
    const queue = own.summary.depositableValidatorsCount;

    if (target === ShareLimitStatus.EXHAUSTED && queue < 2n) {
      throw new Error(
        `"EXHAUSTED" needs at least 2 depositable keys in the queue (got ${queue}) — add keys first`,
      );
    }

    // capacity = base * shareLimit / PERCENT_BASIS, activeLeft = capacity - active
    const wantedLeft =
      target === ShareLimitStatus.REACHED
        ? 0n
        : target === ShareLimitStatus.EXHAUSTED
          ? queue - 1n
          : queue + APPROACHING_THRESHOLD / 2n;
    const wantedCapacity = active + wantedLeft;
    const shareLimit =
      target === ShareLimitStatus.REACHED
        ? (wantedCapacity * PERCENT_BASIS) / base
        : (wantedCapacity * PERCENT_BASIS + base - 1n) / base;

    const activeLeft = (base * shareLimit) / PERCENT_BASIS - active;
    const status = statusOf(activeLeft, queue);
    if (shareLimit > PERCENT_BASIS || status !== target) {
      throw new Error(
        `Cannot reach "${target}": one basis point is ${base / PERCENT_BASIS} key(s), got "${status}" (shareLimit ${shareLimit}, activeLeft ${activeLeft}, queue ${queue})`,
      );
    }

    const [adminRole, shareRole] = await Promise.all([
      this.client.readContract({
        address: router,
        abi: StakingRouterAbi,
        functionName: 'DEFAULT_ADMIN_ROLE',
      }),
      this.client.readContract({
        address: router,
        abi: StakingRouterAbi,
        functionName: 'STAKING_MODULE_SHARE_MANAGE_ROLE',
      }),
    ]);
    const admin = await this.client.readContract({
      address: router,
      abi: StakingRouterAbi,
      functionName: 'getRoleMember',
      args: [adminRole, 0n],
    });
    await this.fund(admin, parseEther('1'));

    await this.sendAs(admin, () =>
      this.client.writeContract({
        address: router,
        abi: StakingRouterAbi,
        functionName: 'grantRole',
        args: [shareRole, admin],
        account: admin,
        chain: null,
      }),
    );

    await this.step(
      `Set stakeShareLimit to ${shareLimit} bp (activeLeft ${activeLeft}, queue ${queue})`,
      () =>
        this.sendAs(admin, () =>
          this.client.writeContract({
            address: router,
            abi: StakingRouterAbi,
            functionName: 'updateModuleShares',
            args: [
              BigInt(own.state.id),
              Number(shareLimit),
              own.state.priorityExitShareThreshold,
            ],
            account: admin,
            chain: null,
          }),
        ),
    );
  });
};
