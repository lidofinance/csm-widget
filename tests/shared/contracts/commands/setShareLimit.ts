import { parseEther } from 'viem';
import { BaseModuleAbi, StakingRouterAbi } from '../abi/index.ts';
import { STAKING_ROUTER } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

// mirrors @lidofinance/lido-csm-sdk calculateShareLimit + useShareLimitStatus
const PERCENT_BASIS = 10_000n;
const MAX_EFFECTIVE_BALANCE_WEI = 32_000_000_000_000_000_000n;
const WEI_PER_GWEI = 1_000_000_000n;
const WC_TYPE_02 = 2;
const APPROACHING_THRESHOLD = 200n;

export type ShareLimitTarget = 'REACHED' | 'EXHAUSTED' | 'APPROACHING';

const readDigests = (service: ForkActionsService) =>
  service.client.readContract({
    address: STAKING_ROUTER[service.chain],
    abi: StakingRouterAbi,
    functionName: 'getAllStakingModuleDigests',
  });

type Digest = Awaited<ReturnType<typeof readDigests>>[number];

const activeStakeEquivalent = (digest: Digest, stakeWei?: bigint): bigint => {
  const { withdrawalCredentialsType, validatorsBalanceGwei } = digest.state;

  if (withdrawalCredentialsType !== WC_TYPE_02) {
    const exited =
      digest.summary.totalExitedValidators > digest.state.exitedValidatorsCount
        ? digest.summary.totalExitedValidators
        : digest.state.exitedValidatorsCount;
    return digest.summary.totalDepositedValidators - exited;
  }

  const stake = stakeWei ?? validatorsBalanceGwei * WEI_PER_GWEI;
  return (stake + MAX_EFFECTIVE_BALANCE_WEI - 1n) / MAX_EFFECTIVE_BALANCE_WEI;
};

const statusOf = (activeLeft: bigint, queue: bigint) =>
  activeLeft <= 0n
    ? 'REACHED'
    : activeLeft - queue < 0n
      ? 'EXHAUSTED'
      : activeLeft - queue < APPROACHING_THRESHOLD
        ? 'APPROACHING'
        : 'FAR';

export const setShareLimit = async function (
  this: ForkActionsService,
  target: ShareLimitTarget,
): Promise<void> {
  await this.step(`[Contract] Set share limit status "${target}"`, async () => {
    const stakingRouter = STAKING_ROUTER[this.chain];

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

    if (target === 'EXHAUSTED' && queue < 2n) {
      throw new Error(
        `"EXHAUSTED" needs at least 2 depositable keys in the queue (got ${queue}) — add keys first`,
      );
    }

    // capacity = base * shareLimit / PERCENT_BASIS, activeLeft = capacity - active
    const wantedLeft =
      target === 'REACHED'
        ? 0n
        : target === 'EXHAUSTED'
          ? queue - 1n
          : queue + APPROACHING_THRESHOLD / 2n;
    const wantedCapacity = active + wantedLeft;
    const shareLimit =
      target === 'REACHED'
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
        address: stakingRouter,
        abi: StakingRouterAbi,
        functionName: 'DEFAULT_ADMIN_ROLE',
      }),
      this.client.readContract({
        address: stakingRouter,
        abi: StakingRouterAbi,
        functionName: 'STAKING_MODULE_SHARE_MANAGE_ROLE',
      }),
    ]);
    const admin = await this.client.readContract({
      address: stakingRouter,
      abi: StakingRouterAbi,
      functionName: 'getRoleMember',
      args: [adminRole, 0n],
    });
    await this.fund(admin, parseEther('1'));

    await this.sendAs(admin, () =>
      this.client.writeContract({
        address: stakingRouter,
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
            address: stakingRouter,
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
