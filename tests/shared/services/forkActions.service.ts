import { test } from '@playwright/test';
import { parseEther } from 'viem';
import * as recipes from '@sm-lab/recipes';
import * as cmRecipes from '@sm-lab/recipes/cm';
import type { Ctx } from '@sm-lab/recipes';
import type { ModuleName } from '@sm-lab/receipts';

export type GateSelector =
  (typeof ForkActionsService.GATE_SELECTOR)[keyof typeof ForkActionsService.GATE_SELECTOR];

type StepFn = <T>(title: string, body: () => Promise<T>) => Promise<T>;

export type ForkActionsOptions = {
  module: ModuleName;
  rpcUrl: string;
  /** Override test.step — pass passthroughStep when running outside test context (e.g. globalSetup). */
  step?: StepFn;
};

/** Pin trees only when an IPFS/Pinata endpoint is actually configured; otherwise skip with fake CIDs (parity with the just-recipes flow, whose CIDs were unresolvable without PINATA_* too). */
const pinningConfigured = () =>
  Boolean(
    process.env.IPFS_API_URL ||
    process.env.PINATA_JWT ||
    (process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET),
  );

/**
 * SM on-chain state manipulation on an anvil fork — in-process typed calls into
 * @sm-lab/recipes (Foundry-free successor of the fork.just + JUST_DIR flow).
 */
export class ForkActionsService {
  private readonly module: ModuleName;
  private readonly rpcUrl: string;
  private readonly step: StepFn;
  private ctxPromise?: Promise<Ctx>;

  constructor(options: ForkActionsOptions) {
    this.module = options.module;
    this.rpcUrl = options.rpcUrl;
    this.step = options.step ?? test.step;
  }

  /** Lazy one-time connect — safe to construct the service when no fork is running. */
  private ctx(): Promise<Ctx> {
    this.ctxPromise ??= recipes.connect({
      module: this.module,
      rpcUrl: this.rpcUrl,
    });
    return this.ctxPromise;
  }

  // ---- Manager / reward address rotation ----
  proposeManager(noId: number, address: `0x${string}`) {
    return this.step(
      `[Fork] Propose manager for NO #${noId} to ${address}`,
      async () =>
        recipes.proposeManager(await this.ctx(), {
          noId: BigInt(noId),
          proposed: address,
        }),
    );
  }
  proposeReward(noId: number, address: `0x${string}`) {
    return this.step(
      `[Fork] Propose reward address for NO #${noId} to ${address}`,
      async () =>
        recipes.proposeReward(await this.ctx(), {
          noId: BigInt(noId),
          proposed: address,
        }),
    );
  }
  confirmManager(noId: number) {
    return this.step(`[Fork] Confirm manager for NO #${noId}`, async () =>
      recipes.confirmManager(await this.ctx(), { noId: BigInt(noId) }),
    );
  }
  confirmReward(noId: number) {
    return this.step(
      `[Fork] Confirm reward address for NO #${noId}`,
      async () =>
        recipes.confirmReward(await this.ctx(), { noId: BigInt(noId) }),
    );
  }

  // ---- Keys ----
  addKeys(noId: number, keysCount: number): Promise<`0x${string}`[]> {
    return this.step(
      `[Fork] Add ${keysCount} key(s) for NO #${noId}`,
      async () => {
        const { publicKeys } = await recipes.addKeys(await this.ctx(), {
          noId: BigInt(noId),
          count: keysCount,
        });
        return publicKeys;
      },
    );
  }
  unvetKeys(noId: number, vettedKeysCount: number) {
    return this.step(
      `[Fork] Unvet keys for NO #${noId} (vetted: ${vettedKeysCount})`,
      async () =>
        recipes.unvet(await this.ctx(), {
          noId: BigInt(noId),
          vettedKeys: BigInt(vettedKeysCount),
        }),
    );
  }
  exitKeys(noId: number, exitedKeysCount: number) {
    return this.step(
      `[Fork] Exit ${exitedKeysCount} key(s) for NO #${noId}`,
      async () =>
        recipes.exit(await this.ctx(), {
          noId: BigInt(noId),
          exitedKeys: BigInt(exitedKeysCount),
        }),
    );
  }
  withdrawKey(
    noId: number,
    keyIndex: number,
    exitBalance = '32',
    slashingPenaltyEth = '0',
  ) {
    return this.step(
      `[Fork] Withdraw key #${keyIndex} for NO #${noId}`,
      async () =>
        recipes.withdraw(await this.ctx(), {
          noId: BigInt(noId),
          keyIndex: BigInt(keyIndex),
          exitBalance: parseEther(exitBalance),
          slashingPenalty: parseEther(slashingPenaltyEth),
        }),
    );
  }
  slashKey(noId: number, keyIndex: number) {
    return this.step(
      `[Fork] Slash key #${keyIndex} for NO #${noId}`,
      async () =>
        recipes.slash(await this.ctx(), {
          noId: BigInt(noId),
          keyIndex: BigInt(keyIndex),
        }),
    );
  }
  removeKey(noId: number, keyIndex: number) {
    return this.step(
      `[Fork] Remove key #${keyIndex} for NO #${noId}`,
      async () =>
        recipes.removeKey(await this.ctx(), {
          noId: BigInt(noId),
          keyIndex: BigInt(keyIndex),
        }),
    );
  }
  depositKeys(depositsCount: number) {
    return this.step(`[Fork] Deposit ${depositsCount} key(s)`, async () =>
      recipes.deposit(await this.ctx(), { count: depositsCount }),
    );
  }

  // ---- Target limits ----
  targetLimit(noId: number, limit: number) {
    return this.step(
      `[Fork] Set target limit ${limit} for NO #${noId}`,
      async () =>
        recipes.setTargetLimit(await this.ctx(), {
          noId: BigInt(noId),
          mode: 1,
          limit: BigInt(limit),
        }),
    );
  }
  targetLimitForced(noId: number, limit: number) {
    return this.step(
      `[Fork] Set forced target limit ${limit} for NO #${noId}`,
      async () =>
        recipes.setTargetLimit(await this.ctx(), {
          noId: BigInt(noId),
          mode: 2,
          limit: BigInt(limit),
        }),
    );
  }
  targetLimitOff(noId: number) {
    return this.step(`[Fork] Turn off target limit for NO #${noId}`, async () =>
      recipes.setTargetLimit(await this.ctx(), {
        noId: BigInt(noId),
        mode: 0,
      }),
    );
  }

  // ---- Penalties (general delayed penalty family) ----
  reportPenalty(noId: number, amount: string | number) {
    return this.step(
      `[Fork] Report penalty for NO #${noId} (amount: ${amount})`,
      async () =>
        recipes.reportPenalty(await this.ctx(), {
          noId: BigInt(noId),
          amount: parseEther(String(amount)),
        }),
    );
  }
  cancelPenalty(noId: number, amount: string | number) {
    return this.step(
      `[Fork] Cancel penalty for NO #${noId} (amount: ${amount})`,
      async () =>
        recipes.cancelPenalty(await this.ctx(), {
          noId: BigInt(noId),
          amount: parseEther(String(amount)),
        }),
    );
  }
  settlePenalty(noId: number) {
    return this.step(`[Fork] Settle penalty for NO #${noId}`, async () =>
      recipes.settlePenalty(await this.ctx(), { noId: BigInt(noId) }),
    );
  }
  compensatePenalty(noId: number) {
    return this.step(`[Fork] Compensate penalty for NO #${noId}`, async () =>
      recipes.compensatePenalty(await this.ctx(), { noId: BigInt(noId) }),
    );
  }

  // ---- Bond ----
  addBond(noId: number, amountEth: string) {
    return this.step(
      `[Fork] Add bond ${amountEth} ETH for NO #${noId}`,
      async () =>
        recipes.addBond(await this.ctx(), {
          noId: BigInt(noId),
          amount: parseEther(amountEth),
        }),
    );
  }
  createBondDebt(noId: number, amountEth: string) {
    return this.step(
      `[Fork] Create bond debt ${amountEth} ETH for NO #${noId}`,
      async () =>
        recipes.createBondDebt(await this.ctx(), {
          noId: BigInt(noId),
          amount: parseEther(amountEth),
        }),
    );
  }

  // ---- Rewards ----
  reportRewards() {
    return this.step('[Fork] Report rewards (make + submit)', async () => {
      const ctx = await this.ctx();
      const report = await recipes.makeRewards(
        ctx,
        pinningConfigured()
          ? {}
          : { treeCid: 'fork-rewards-tree', logCid: 'fork-rewards-log' },
      );
      await recipes.submitRewards(ctx, report);
      return report;
    });
  }

  // ---- Exit requests / validators ----
  exitRequest(noId: number, keyIndex: number, validatorIndex?: number) {
    return this.step(
      `[Fork] Exit request for NO #${noId}, key #${keyIndex}`,
      async () =>
        recipes.exitRequest(await this.ctx(), {
          noId: BigInt(noId),
          keyIndex: BigInt(keyIndex),
          validatorIndex:
            validatorIndex === undefined ? undefined : BigInt(validatorIndex),
        }),
    );
  }

  // ---- Pause / resume (module | accounting | gate selector) ----
  pause(target: 'module' | 'accounting' | string) {
    return this.step(`[Fork] Pause ${target}`, async () =>
      recipes.pause(await this.ctx(), { target }),
    );
  }
  resume(target: 'module' | 'accounting' | string) {
    return this.step(`[Fork] Resume ${target}`, async () =>
      recipes.resume(await this.ctx(), { target }),
    );
  }

  // ---- Reads ----
  getCurveInfo(id: number) {
    return this.step(`[Fork] Get curve info #${id}`, async () =>
      recipes.getCurveInfo(await this.ctx(), { curveId: BigInt(id) }),
    );
  }

  // ---- CM: groups & curated operators ----
  createOperatorGroup(operators: Array<{ id: number; weight: number }>) {
    return this.step(
      `[Fork] Create operator group (${operators.length} operators)`,
      async () =>
        cmRecipes.createOperatorGroup(await this.ctx(), {
          // service takes percent weights (50 = 50%); recipe wants basis points summing to 10000
          pairs: operators.map(
            ({ id, weight }) =>
              [BigInt(id), BigInt(weight * 100)] as [bigint, bigint],
          ),
        }),
    );
  }

  static readonly GATE_SELECTOR = {
    po: 'po',
    pto: 'pto',
    pgo: 'pgo',
    do: 'do',
    eeo: 'eeo',
    iodc: 'iodc',
    iodcp: 'iodcp',
    ics: 'ics',
    idvtc: 'idvtc',
  } as const;

  createCuratedOperator(
    gateSelector: GateSelector,
    address: `0x${string}`,
  ): Promise<number | undefined> {
    return this.step(
      `[Fork] Create curated operator via gate "${gateSelector}" for ${address}`,
      async () => {
        try {
          const { noId } = await cmRecipes.createCuratedOperator(
            await this.ctx(),
            { selector: gateSelector, operator: address },
          );
          return Number(noId);
        } catch (err) {
          if (err instanceof Error && err.message.includes('AlreadyConsumed')) {
            console.warn(
              `[ForkActionsService] Operator ${address} already consumed gate "${gateSelector}", skipping`,
            );
            return undefined;
          }
          throw err;
        }
      },
    );
  }

  setGateAddrs(
    selector: GateSelector | GateSelector[],
    ...addresses: `0x${string}`[]
  ) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    return this.step(
      `[Fork] Set gate tree for [${selectors.join(', ')}] → ${addresses.join(', ')}`,
      async () => {
        const ctx = await this.ctx();
        for (const sel of selectors) {
          const { treeRoot, treeCid } = await recipes.setGateAddrs(ctx, {
            selector: sel,
            addresses,
            ...(pinningConfigured() ? {} : { cid: `fork-gate-${sel}` }),
          });
          console.info(`[Fork] gate ${sel}: root=${treeRoot} cid=${treeCid}`);
        }
      },
    );
  }
}

export default ForkActionsService;
