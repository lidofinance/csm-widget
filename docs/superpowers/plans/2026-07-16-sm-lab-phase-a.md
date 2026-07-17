# sm-lab Phase A (Toolchain Swap) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-rolled e2e fork toolchain (`just` + staking-modules checkout + Foundry + `eth-staking-smith` binary) with in-process `@sm-lab/*` libraries and a prool-managed anvil node in CI.

**Architecture:** `ForkActionsService` keeps its public method surface but its guts become typed in-process calls into `@sm-lab/recipes` (lazy `connect()` per suite module). `KeysGeneratorService` becomes a thin async wrapper over `@sm-lab/keys`. Node lifecycle in CI moves to `prool` (`anvil` instance); local runs stay bring-your-own-fork on `:8545`. CI drops the contracts checkout/build and binary downloads.

**Tech Stack:** `@sm-lab/recipes@^0.4.1`, `@sm-lab/keys@^0.2.1`, `@sm-lab/receipts@^0.2.0`, `prool@^0.2.10`, Playwright 1.61, viem, Node 24.

**Runtime model (corrected 2026-07-16 — the original plan's premise was wrong):** this repo is **native ESM** — root `package.json` has `"type": "module"`, `tsconfig` uses `module: esnext`, and Playwright 1.61 loads its config and every spec through Node's **ESM loader** (it does NOT transpile to CJS + `require()`). So the sm-lab packages are consumed through their `import` export condition — the services use ordinary static `import` (as written in Tasks 2–3). There is no `require()` in the load path; any `require()`-based reasoning from the original draft does not apply. Consequence: Node's ESM loader **strictly enforces package `exports` maps** (unlike the widget's webpack build, which is lenient), so a transitive dep that references an unexported subpath is a hard load error — see the sm-lab preconditions below.

**Spec:** `docs/superpowers/specs/2026-07-16-sm-lab-test-infra-design.md` (Phase A section).

## Global Constraints

- **sm-lab package preconditions (external — must be true before Task 1's gate can pass):** the published `@sm-lab/recipes` / `@sm-lab/keys` are being fixed upstream. For this plan to run they must:
  1. **Resolve their transitive crypto deps under strict Node ESM.** As shipped, `@sm-lab/*` pull `@scure/bip39@2.2.0`, which statically imports `@noble/hashes/{webcrypto.js,sha,pbkdf}` — the `@noble/hashes@2.x` module layout. This repo pins `@noble/hashes@1.8.0` (held there by ~34 deps: viem/wagmi/lido), whose `exports` do not define those subpaths, so Node's ESM loader throws `ERR_PACKAGE_PATH_NOT_EXPORTED`. Fix in sm-lab by **bundling its crypto deps into `dist`** (self-contained, immune to the consumer's hoist) or aligning `@scure/bip39` to a line that works against `@noble/hashes@1.8.0`. (A `require` export condition is NOT needed — the load path is ESM.)
  2. **Be type-resolvable under this repo's `tsconfig` (`moduleResolution: node`).** RESOLVED 2026-07-16 for `@sm-lab/recipes@0.4.2` / `@sm-lab/keys@0.2.2`: the patched packages added a top-level `types` field, so the root entries and `@sm-lab/keys` / `@sm-lab/receipts` now resolve under node10. The one remaining gap is the **subpath** `@sm-lab/recipes/cm` (Task 3), which node10 cannot resolve because it does not read subpath `exports`. Fixed in-repo with a single `tsconfig` `paths` shim (compile-time only; runtime ESM resolution via `exports` is unaffected):
     ```jsonc
     "paths": { "@sm-lab/recipes/cm": ["./node_modules/@sm-lab/recipes/dist/cm.d.mts"] }
     ```
     **Do NOT switch the repo to `moduleResolution: "bundler"`** — it was tried and produces **388 errors**: the entire `@lidofinance/*` ecosystem (`lido-ui`, `analytics-matomo`, `api-rpc`, `next-api-wrapper`, `eth-providers`, …) ships `exports` maps with no `types` condition and relies on legacy node10 resolution finding `dist/index.d.ts`. The `paths` shim is the correct minimal fix; it can be removed later if sm-lab ships node10 subpath types (e.g. `typesVersions`).
- `type` not `interface`; function expressions only; no `console.log` (use `console.info`/`warn`/`error`); unused vars prefixed `_`; 2-space indent, single quotes, trailing commas.
- Conventional commits; commit UNSIGNED: `git commit --no-gpg-sign`.
- Run `yarn lint:fix` after each task's code changes; `yarn types` must pass at every commit.
- Do NOT remove `@lidofinance/wallets-testing-nodes` from package.json — `BrowserService` (from `@lidofinance/browser-service`) and `base.config.ts` still consume its `EthereumNodeServiceOptions` type. Only the `EthereumNodeService` class usage (node lifecycle) is removed.
- Do NOT touch `parseDevnetAddresses` / `DEVNET_ADDRESSES_FILE_PATH` (devnet-stand escape hatch, non-fork flows).
- **Behavior change to preserve intentionally:** csm-widget `globalSetup` today starts anvil even locally; after this plan BOTH suites start the node in CI only (`process.env.CI`). Local fork runs bring their own anvil on `:8545` (e.g. `anvil --fork-url $RPC_URL`). A preflight check prints that hint.
- **Pinning parity:** today's CI has no PINATA secrets, so gate/rewards trees get non-resolvable CIDs (verified: `staking-modules/script/mock-rewards.mjs` falls back to "local CIDs"). The new code must replicate: pin only when `IPFS_API_URL` or `PINATA_*` env is configured; otherwise pass explicit fake CIDs to the recipes' skip-pinning escape hatches. Never let `assertPinnable` probe (and throw on) an absent local IPFS mock.

## File Structure

| Action  | Path                                                                              | Responsibility                                 |
| ------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| Modify  | `package.json`                                                                    | devDeps + `test:setup` script                  |
| Rewrite | `tests/shared/services/keysGenerator.service.ts`                                  | async BLS keys via `@sm-lab/keys`              |
| Rewrite | `tests/shared/services/forkActions.service.ts`                                    | typed recipes via `@sm-lab/recipes`            |
| Create  | `tests/shared/services/forkNode.service.ts`                                       | prool anvil lifecycle + reachability preflight |
| Modify  | `tests/cm-widget/config/globalSetup.ts`, `tests/csm-widget/config/globalSetup.ts` | CI node start via prool, preflight, warm-up    |
| Rewrite | `tests/cm-widget/config/globalTeardown.ts`                                        | `stopForkNode()` instead of `pkill`            |
| Create  | `tests/csm-widget/config/globalTeardown.ts`                                       | same (csm has none today)                      |
| Modify  | `tests/csm-widget/playwright.config.ts`                                           | register globalTeardown                        |
| Modify  | `tests/cm-widget/tests/test.fixture.ts`, `tests/csm-widget/tests/test.fixture.ts` | new `ForkActionsService` ctor                  |
| Modify  | `tests/cm-widget/config/walletSetup/walletStates.ts`                              | new ctor options type                          |
| Modify  | ~45 `generateKeys(` call sites (both suites)                                      | add `await`                                    |
| Create  | `tests/cm-widget/tests/infraSmoke.spec.ts`                                        | fork-tagged live smoke of recipes wiring       |
| Delete  | `tests/scripts/set_up_keys_generator.sh`, `tests/scripts/install_foundry.sh`      | obsolete                                       |
| Modify  | `.github/workflows/e2e-tests.yml`, `tests-fork.yml`, `tests-fork-cm.yml`          | drop contracts/just/keys steps + inputs        |
| Modify  | `CLAUDE.md`                                                                       | test-setup description                         |

Handlers (`tests/cm-widget/config/walletSetup/handlers/*`) need **no changes** — the service keeps `createCuratedOperator(gate, address)`, `addKeys(noId, count)`, `depositKeys(count)`, `createOperatorGroup([{id, weight}])` signatures.

---

### Task 1: Add sm-lab + prool dependencies

**Files:**

- Modify: `package.json`

**Interfaces:**

- Produces: ESM-importable `@sm-lab/recipes`, `@sm-lab/recipes/cm`, `@sm-lab/keys`, `@sm-lab/receipts`, and top-level `prool` (`Instance.anvil`) for Tasks 2–4.

- [ ] **Step 1: Add devDependencies**

Run:

```bash
yarn add -D @sm-lab/recipes@^0.4.1 @sm-lab/keys@^0.2.1 @sm-lab/receipts@^0.2.0 prool@^0.2.10
```

Expected: lockfile updated, install succeeds.

- [ ] **Step 2: Verify the packages load under Node's ESM loader (the mechanism Playwright actually uses)**

Run (ESM entry — `import()`, not `require()`; the repo is `type: module`):

```bash
node --input-type=module -e "await import('@sm-lab/recipes'); await import('@sm-lab/recipes/cm'); await import('@sm-lab/keys'); await import('@sm-lab/receipts'); const p = await import('prool'); if (typeof p.Instance.anvil !== 'function') throw new Error('prool Instance.anvil missing'); console.info('esm-import ok')"
```

Expected: `esm-import ok`. STOP conditions (do not proceed / do not commit):

- `ERR_PACKAGE_PATH_NOT_EXPORTED` naming a path inside `@noble/hashes` / `@scure/bip39` → the sm-lab crypto-dep precondition (Global Constraints #1) is not yet satisfied. The upstream sm-lab fix is incomplete. Report BLOCKED.
- Any failure at an `@sm-lab/*` boundary itself → the published build is still ESM-import-broken. Report BLOCKED.

Note: this gate uses top-level `prool` (`Instance.anvil`) — `prool@0.2.10` has **no** `prool/instances` subpath export (see Task 4).

- [ ] **Step 2b: Verify TypeScript can resolve the sm-lab types**

Add a scratch file importing one symbol from each sm-lab package and run `yarn types`. Expected: no `Could not find a declaration file for module '@sm-lab/...'`. If it fails, the type-resolution precondition (Global Constraints #2) is unmet — STOP and resolve that (sm-lab node10 types, or the `moduleResolution: bundler` decision) before continuing. Delete the scratch file after.

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit --no-gpg-sign -m "chore(tests): add @sm-lab and prool dev dependencies"
```

---

### Task 2: KeysGeneratorService over @sm-lab/keys

**Files:**

- Rewrite: `tests/shared/services/keysGenerator.service.ts`
- Modify: every `generateKeys(` call site (both suites) — add `await`
- Modify: `package.json` (`test:setup` script)
- Delete: `tests/scripts/set_up_keys_generator.sh`

**Interfaces:**

- Consumes: `makeDepositKeys({ chain, count, mnemonic?, type, withdrawalAddress?, startIndex? }): Promise<{ mnemonic: string; keys: DepositKey[] }>` from `@sm-lab/keys`.
- Produces: `class KeysGeneratorService { constructor(options?: { isCM?: boolean }); generateKeys(numValidators?, chain?, withdrawalCredentials?, mnemonic?): Promise<DepositKey[]>; getDepositKeys(): DepositKey[]; getMnemonic(): string }`. `DepositKey` re-exported (same JSON field names as before: `pubkey`, `withdrawal_credentials`, `amount`, `signature`, `deposit_message_root`, `deposit_data_root`, `fork_version`, `network_name`, `deposit_cli_version`).

- [ ] **Step 1: Rewrite the service**

Replace the entire content of `tests/shared/services/keysGenerator.service.ts` with:

```typescript
import {
  makeDepositKeys,
  type ChainName,
  type DepositKey,
  type MakeDepositKeysResult,
} from '@sm-lab/keys';

export type { DepositKey };

/**
 * BLS deposit-data generator over @sm-lab/keys (pure TS, in-process).
 * Replaces the eth-staking-smith binary. Keys pass the SDK's on-upload BLS validation.
 */
export class KeysGeneratorService {
  private lastResult: MakeDepositKeysResult | null = null;

  constructor(private options?: { isCM?: boolean }) {}

  /**
   * Generates deposit keys.
   * @param numValidators - number of validators (default 1)
   * @param chain - network (default 'hoodi')
   * @param withdrawalCredentials - withdrawal address (defaults to the Lido withdrawal vault)
   * @param mnemonic - BIP-39 phrase for reproducible keys (random when omitted)
   */
  async generateKeys(
    numValidators = 1,
    chain: ChainName = 'hoodi',
    withdrawalCredentials = '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2' as const,
    mnemonic?: string,
  ): Promise<DepositKey[]> {
    this.lastResult = await makeDepositKeys({
      chain,
      count: numValidators,
      type: this.options?.isCM ? '0x02' : '0x01',
      withdrawalAddress: withdrawalCredentials,
      mnemonic,
    });
    return this.lastResult.keys;
  }

  getDepositKeys(): DepositKey[] {
    return this.lastResult?.keys ?? [];
  }

  getMnemonic(): string {
    return this.lastResult?.mnemonic ?? '';
  }
}
```

Notes:

- The old `password` parameter is gone (no keystores are produced; no consumer used them — verified: no `getPrivateKeys`/`getKeystores`/`getAllData` call sites outside the service).
- The old service wrote `deposit_data.json` to cwd; nothing consumed it except the service itself. No file I/O remains.

- [ ] **Step 2: Sweep call sites — make callers await**

`generateKeys` is now async. Find every call site:

```bash
grep -rn "generateKeys(" tests --include='*.ts' | grep -v "keysGenerator.service"
```

Each hit is inside an async test/step body. Mechanical edit per site: `keysGeneratorService.generateKeys(...)` → `await keysGeneratorService.generateKeys(...)`. Sites that chain immediately (e.g. `new KeysGeneratorService({ isCM: true }).generateKeys()`) become `await new KeysGeneratorService({ isCM: true }).generateKeys()`. Sites already storing to a variable typed `DepositKey[]` need only the `await`.

- [ ] **Step 3: Type-check to prove the sweep is complete**

Run: `yarn types`
Expected: PASS. Any missed call site fails with `Property 'X' does not exist on type 'Promise<DepositKey[]>'` — fix and re-run.

- [ ] **Step 4: Remove the binary setup**

```bash
git rm tests/scripts/set_up_keys_generator.sh
```

In `package.json` change:

```json
"test:setup": "npx playwright install chromium && ./tests/scripts/set_up_keys_generator.sh && yarn test:setup:fork",
```

to

```json
"test:setup": "npx playwright install chromium",
```

(leave the `"test:setup:fork": "./tests/scripts/install_foundry.sh"` script line in place for now — it is deleted in Task 6 together with the script file and the CI steps that reference Foundry.)

- [ ] **Step 5: Lint + commit**

```bash
yarn lint:fix
git add -A tests package.json
git commit --no-gpg-sign -m "feat(tests): generate deposit keys in-process via @sm-lab/keys"
```

---

### Task 3: ForkActionsService over @sm-lab/recipes

**Files:**

- Rewrite: `tests/shared/services/forkActions.service.ts`
- Modify: `tests/cm-widget/tests/test.fixture.ts` (forkActionService fixture, ~line 42)
- Modify: `tests/csm-widget/tests/test.fixture.ts` (forkActionService fixture, ~line 42)
- Modify: `tests/cm-widget/config/walletSetup/walletStates.ts` (ctor passthrough — type only)
- Modify: `tests/cm-widget/config/globalSetup.ts` (WalletStateService ctor args)

**Interfaces:**

- Consumes: `connect`, shared recipes, and `@sm-lab/recipes/cm` (`createCuratedOperator`, `createOperatorGroup`) — exact signatures inlined below.
- Produces: `class ForkActionsService` with `constructor(options: ForkActionsOptions)` where `ForkActionsOptions = { module: 'csm' | 'cm'; rpcUrl: string; step?: StepFn }`. Method signatures preserved for all call sites: `proposeManager(noId, address)`, `proposeReward(noId, address)`, `confirmManager(noId)`, `confirmReward(noId)`, `addKeys(noId, count)` (now returns `Promise<0x${string}[]>` pubkeys), `depositKeys(count)`, `addBond(noId, amountEth)`, `reportPenalty(noId, amountEth)`, `settlePenalty(noId)`, `cancelPenalty(noId, amountEth)`, `compensatePenalty(noId)`, `reportRewards()`, `createBondDebt(noId, amountEth)`, `createOperatorGroup(operators)`, `createCuratedOperator(gate, address)`, `setGateAddrs(selector | selectors, ...addresses)`, `unvetKeys`, `exitKeys`, `withdrawKey`, `slashKey`, `removeKey`, `targetLimit`, `targetLimitForced`, `targetLimitOff`, `exitRequest(noId, keyIndex, validatorIndex?)` (signature changed — zero call sites), `pause(target)`, `resume(target)`, `getCurveInfo(id)`, static `GATE_SELECTOR`.
- **Dropped** (no recipe backing, zero call sites — verified by census): `run`, `stuckKeys`, `voteAddModule`, `voteUpgrade`, `publicRelease`, `reportStealing`, `cancelStealing`, `settleStealing`, `compensateStealing`, `pauseCsm`/`resumeCsm`/`pauseAccounting`/`resumeAccounting` (replaced by `pause`/`resume`).

- [ ] **Step 1: Rewrite the service**

Replace the entire content of `tests/shared/services/forkActions.service.ts` with:

```typescript
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
```

- [ ] **Step 2: Update the three construction sites**

`tests/cm-widget/tests/test.fixture.ts` — replace the `forkActionService` fixture body:

```typescript
  forkActionService: [
    async ({}, use) => {
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const svc = new ForkActionsService({ module: 'cm', rpcUrl: forkRpcURL });
      await use(svc);
    },
    { scope: 'worker' },
  ],
```

`tests/csm-widget/tests/test.fixture.ts` — same edit with `module: 'csm'` (the file already computes `forkRpcURL` the same way in sibling fixtures; reuse the identical expression).

`tests/cm-widget/config/globalSetup.ts` — the `WalletStateService` construction changes from

```typescript
const walletService = new WalletStateService({
  cwd: process.env.JUST_DIR || './staking-modules',
  step: passthroughStep,
});
```

to

```typescript
const walletService = new WalletStateService({
  module: 'cm',
  rpcUrl: forkRpcURL,
  step: passthroughStep,
});
```

(`forkRpcURL` is already in scope in that file; move `setupPresetAccounts` call to pass it: change the signature to `const setupPresetAccounts = async (forkRpcURL: string): Promise<void>` and the call to `await setupPresetAccounts(forkRpcURL);`.)

`tests/cm-widget/config/walletSetup/walletStates.ts` needs no logic change — `ForkActionsOptions` import stays valid (the type changed shape; the constructor passthrough compiles as-is). Verify only that the ctor param is `options: ForkActionsOptions` (non-optional now, since module/rpcUrl are required): change `constructor(options?: ForkActionsOptions)` to `constructor(options: ForkActionsOptions)`.

- [ ] **Step 3: Type-check**

Run: `yarn types`
Expected: PASS. Any remaining `cwd`/`JUST_DIR`/`env`/`chain` usages of the old options fail loudly — remove them (`grep -rn "JUST_DIR" tests .github` must come back empty except workflow files handled in Task 7).

- [ ] **Step 4: Lint + commit**

```bash
yarn lint:fix
git add tests
git commit --no-gpg-sign -m "feat(tests): fork actions via in-process @sm-lab/recipes (drop just/JUST_DIR)"
```

---

### Task 4: Node lifecycle — prool in CI, BYO fork locally

**Files:**

- Create: `tests/shared/services/forkNode.service.ts`
- Modify: `tests/cm-widget/config/globalSetup.ts`
- Rewrite: `tests/cm-widget/config/globalTeardown.ts`
- Modify: `tests/csm-widget/config/globalSetup.ts`
- Create: `tests/csm-widget/config/globalTeardown.ts`
- Modify: `tests/csm-widget/playwright.config.ts` (add `globalTeardown` — cm's config already has it)

**Interfaces:**

- Consumes: `Instance.anvil(anvilOpts)` + `Server`/`Pool` from top-level `prool` (see the prool API note in Step 1). NOT `prool/instances` — that subpath does not exist in `prool@0.2.10`.
- Produces: `startForkNode(opts: { forkUrl: string; mnemonic: string; port: number; host: string }): Promise<void>`, `stopForkNode(): Promise<void>`, `assertForkReachable(rpcUrl: string): Promise<void>` — module-level singleton; globalSetup and globalTeardown run in the same runner process, so the instance survives between them.

- [ ] **Step 1: Create `tests/shared/services/forkNode.service.ts`**

> **prool API corrected 2026-07-16:** `prool@0.2.10` has **no** `prool/instances` subpath export. The anvil factory is `Instance.anvil(...)` reached from the top-level package: `import { Instance, Server } from 'prool'`. The top-level package exposes only `Instance`, `Pool`, `Server`. A single anvil on a fixed host/port is created by wrapping the instance definition in a `Server` (or `Pool`). **The implementer MUST verify the exact single-fixed-port wiring against prool's `.d.ts` once `node_modules` is reinstalled** — specifically (a) the exact anvil option names (`forkUrl`, `mnemonic`, …), (b) whether `Server.create` exposes the node at the bare `host:port` or at a pooled path suffix like `/1` (if a suffix, `assertForkReachable` and every `rpcUrl` in globalSetup must include it), and (c) the stop method name. Treat the snippet below as the intended shape, not verified verbatim code.

```typescript
import { Instance, Server } from 'prool';
import { createPublicClient, http } from 'viem';

type ForkNodeOptions = {
  /** Upstream RPC to fork (RPC_URL). */
  forkUrl: string;
  mnemonic: string;
  port: number;
  host: string;
};

let server: ReturnType<typeof Server.create> | undefined;

/** Start a prool-managed anvil fork (CI path). Requires the `anvil` binary on PATH. */
export const startForkNode = async (
  options: ForkNodeOptions,
): Promise<void> => {
  if (server) return;
  server = Server.create({
    instance: Instance.anvil({
      forkUrl: options.forkUrl,
      mnemonic: options.mnemonic,
    }),
    host: options.host,
    port: options.port,
  });
  await server.start();
  console.info(
    `[forkNode] anvil fork listening on ${options.host}:${options.port}`,
  );
};

export const stopForkNode = async (): Promise<void> => {
  if (!server) return;
  await server.stop();
  server = undefined;
  console.info('[forkNode] anvil stopped');
};

/** Fail fast with a actionable hint when no fork is reachable (local BYO-fork path). */
export const assertForkReachable = async (rpcUrl: string): Promise<void> => {
  const client = createPublicClient({ transport: http(rpcUrl) });
  try {
    await client.getChainId();
  } catch {
    throw new Error(
      `No EVM node reachable at ${rpcUrl}. Start your own fork first, e.g.:\n` +
        `  anvil --fork-url $RPC_URL --port ${new URL(rpcUrl).port}\n` +
        `(in CI the node is started automatically)`,
    );
  }
};
```

- [ ] **Step 2: Rewrite the fork block of `tests/cm-widget/config/globalSetup.ts`**

Replace the `EthereumNodeService` import and the CI node-start block:

```typescript
// DELETE this import:
import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
// ADD:
import {
  startForkNode,
  assertForkReachable,
} from 'tests/shared/services/forkNode.service';
```

Body of `globalSetup()` becomes:

```typescript
export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const { host, port, rpcUrl } = widgetFullConfig.standConfig.nodeConfig;
  const forkRpcURL = `http://${host}:${port}`;

  if (process.env.CI) {
    await startForkNode({
      forkUrl: rpcUrl,
      mnemonic: secretPhrase,
      port,
      host,
    });
  }
  await assertForkReachable(forkRpcURL);

  const cmSDK = new LidoSDKClient([forkRpcURL], {} as Record<string, string>);
  await warmUpForkedNode(cmSDK, secretPhrase);

  await setupPresetAccounts(forkRpcURL);
}
```

(the `setupPresetAccounts(forkRpcURL)` signature change was done in Task 3; keep everything else in the file as-is. Warm-up moves out of the old `warmUpCallback` and now also runs for local BYO forks — that replaces the node-service callback wiring.)

Note: `nodeConfig.port` is typed by the existing config; if it is a string in config, coerce with `Number(port)` at the `startForkNode` call.

- [ ] **Step 3: Rewrite `tests/cm-widget/config/globalTeardown.ts`**

```typescript
import { stopForkNode } from 'tests/shared/services/forkNode.service';

export default async function globalTeardown() {
  if (process.env.CI) {
    await stopForkNode();
  }
}
```

- [ ] **Step 4: Same for the csm suite**

`tests/csm-widget/config/globalSetup.ts` — full new content (this suite has no preset accounts):

```typescript
import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKClient } from 'tests/csm-widget/services/csmSDK.client';
import {
  startForkNode,
  assertForkReachable,
} from 'tests/shared/services/forkNode.service';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const { host, port, rpcUrl } = widgetFullConfig.standConfig.nodeConfig;
  const forkRpcURL = `http://${host}:${port}`;

  if (process.env.CI) {
    await startForkNode({
      forkUrl: rpcUrl,
      mnemonic: secretPhrase,
      port,
      host,
    });
  }
  await assertForkReachable(forkRpcURL);

  const csmSDK = new LidoSDKClient([forkRpcURL]);
  await warmUpForkedNode(csmSDK, secretPhrase);
}
```

**Behavior change (intentional, per spec):** csm previously auto-started anvil locally too; now local runs bring their own fork and get the `assertForkReachable` hint if they didn't.

Create `tests/csm-widget/config/globalTeardown.ts` with the same content as cm's (Step 3), and register it in `tests/csm-widget/playwright.config.ts` next to the existing `globalSetup` line:

```typescript
  globalTeardown: './config/globalTeardown.ts',
```

- [ ] **Step 5: Type-check, lint, commit**

```bash
yarn types && yarn lint:fix
git add tests
git commit --no-gpg-sign -m "feat(tests): prool-managed anvil fork in CI, BYO-fork preflight locally"
```

---

### Task 5: Live infra smoke spec (fork-tagged)

**Files:**

- Create: `tests/cm-widget/tests/infraSmoke.spec.ts`

**Interfaces:**

- Consumes: `test` fixture (`forkActionService`, `cmSDK`, `evmNode`), `Tags` from `tests/shared/consts/common.const`.
- Produces: a `@forked`-tagged spec that proves the recipes wiring against a real fork — the executable verification for Tasks 3–4.

- [ ] **Step 1: Write the spec**

```typescript
import { expect } from '@playwright/test';
import { test } from './test.fixture';
import { Tags } from 'tests/shared/consts/common.const';

test.describe('sm-lab infra smoke', { tag: [Tags.forked] }, () => {
  let snapshotId: string;

  test.beforeAll(async ({ evmNode }) => {
    snapshotId = await evmNode.snapshot();
  });

  test.afterAll(async ({ evmNode }) => {
    await evmNode.revert(snapshotId);
  });

  test('Should add keys via recipes', async ({
    forkActionService,
    widgetService,
  }) => {
    const noId = await test.step('Get operator id', () =>
      widgetService.extractNodeOperatorId());

    await test.step('Add 2 keys and get pubkeys back', async () => {
      const pubkeys = await forkActionService.addKeys(noId, 2);
      expect(pubkeys).toHaveLength(2);
      expect(pubkeys[0]).toMatch(/^0x[0-9a-f]{96}$/);
    });
  });
});
```

Adjust the operator-id acquisition to the suite's existing pattern if `extractNodeOperatorId` requires an open page first (mirror what `tests/cm-widget/tests/operatorWithValidator` specs do in their `beforeAll` — open the page via `widgetService`, then extract). Copy the exact `beforeAll` open call from `tests/cm-widget/tests/operatorWithValidator/keys/common.spec.ts`.

- [ ] **Step 2: Run it against a live fork (needs `RPC_URL` + anvil + a stand)**

Local (bring your own fork):

```bash
anvil --fork-url "$RPC_URL" --port 8545 &
USE_FORK=true TEST_TAGS='@forked' yarn test:cm:e2e --grep "sm-lab infra smoke"
```

Expected: PASS (1 test). If no `RPC_URL`/stand is available in this environment, mark this step as deferred-to-CI and say so in the task report — do not fake a pass.

- [ ] **Step 3: Commit**

```bash
yarn lint:fix
git add tests/cm-widget/tests/infraSmoke.spec.ts
git commit --no-gpg-sign -m "test(cm): sm-lab recipes infra smoke spec"
```

---

### Task 6: CI workflow cleanup

**Files:**

- Modify: `.github/workflows/e2e-tests.yml`
- Modify: `.github/workflows/tests-fork.yml`
- Modify: `.github/workflows/tests-fork-cm.yml`
- Modify: `package.json` (drop `test:setup:fork` script)
- Delete: `tests/scripts/install_foundry.sh` (and remove `tests/scripts/` if now empty)

**Interfaces:**

- Consumes: nothing from other tasks (pure YAML/script edits).
- Produces: fork CI that only needs Node + Playwright + the `anvil` binary.

- [ ] **Step 1: Edit `.github/workflows/e2e-tests.yml`**

Remove these workflow_call **inputs** (with their descriptions): `staking_modules_ref`, `deploy_config`, `chain`.

Remove these **env** lines from the job:

```yaml
DEPLOY_CONFIG: ${{ inputs.deploy_config }}
CHAIN: ${{ inputs.chain }}
```

Remove these **steps** entirely:

- `Checkout staking-modules` (`actions/checkout` of `lidofinance/staking-modules`)
- `Setup just` (`./.github/actions/setup-just`)
- `Install contracts dependencies` (`cd staking-modules && yarn install --immutable`)
- `Build fork` (`cd staking-modules && just deps && just build`)
- `Download keys generator binary` (`bash ./tests/scripts/set_up_keys_generator.sh`)

KEEP the `Install Foundry` step (`foundry-rs/foundry-toolchain@v1`) — prool spawns the `anvil` binary from it. Update the `use_fork` input description from "adds contract checkout + build steps" to "starts a prool-managed anvil fork".

- [ ] **Step 2: Edit the two caller workflows**

Remove the now-invalid inputs (passing an undeclared input fails `workflow_call`).

`.github/workflows/tests-fork.yml` — remove these three lines (~41-44):

```yaml
staking_modules_ref: test/local-scripts
deploy_config: ./artifacts/hoodi/upgrade-v3-hoodi.json
chain: hoodi
```

`.github/workflows/tests-fork-cm.yml` — remove these three lines (~41-43):

```yaml
staking_modules_ref: test/local-scripts
deploy_config: ./artifacts/hoodi/curated/deploy-hoodi.json
chain: hoodi
```

- [ ] **Step 3: Drop the foundry setup script**

```bash
git rm tests/scripts/install_foundry.sh
rmdir tests/scripts 2>/dev/null || true
```

In `package.json` delete the line: `"test:setup:fork": "./tests/scripts/install_foundry.sh",` (Task 2 already removed its caller from `test:setup`).

- [ ] **Step 4: Validate YAML + grep for leftovers**

Run:

```bash
for f in e2e-tests tests-fork tests-fork-cm; do npx --yes js-yaml ".github/workflows/$f.yml" > /dev/null && echo "$f ok"; done
grep -rn "JUST_DIR\|staking-modules\|setup-just\|set_up_keys_generator\|install_foundry\|DEPLOY_CONFIG\|eth-staking-smith" .github tests package.json CLAUDE.md || echo "clean"
```

Expected: three `ok` lines, then `clean` — except a possible `CLAUDE.md` hit ("keys generator"), which Task 7 fixes; that is the only acceptable remainder.

- [ ] **Step 5: Commit**

```bash
git add -A .github tests package.json
git commit --no-gpg-sign -m "ci: drop staking-modules/just/keys-binary setup from fork e2e"
```

---

### Task 7: Documentation

**Files:**

- Modify: `CLAUDE.md`

**Interfaces:** none.

- [ ] **Step 1: Update the test-setup line in `CLAUDE.md`**

Change:

```markdown
- **Test setup**: `yarn test:setup` - Installs Chromium, keys generator, and Foundry fork tooling
```

to:

```markdown
- **Test setup**: `yarn test:setup` - Installs Chromium (fork state/keys tooling now ships as `@sm-lab/*` npm deps; local fork runs need your own `anvil --fork-url $RPC_URL`)
```

- [ ] **Step 2: Final full check + commit**

```bash
yarn types && yarn lint
git add CLAUDE.md
git commit --no-gpg-sign -m "docs: update test setup notes for sm-lab toolchain"
```

---

## Self-Review Notes (kept for the executor)

- **Revision 2026-07-16 (ESM correction):** the original draft assumed Playwright transpiles specs to CJS and `require()`s them, and gated Task 1 on `require()`. That is wrong: this repo is native ESM (`type: module` + Playwright 1.61 ESM loader), so packages load via their `import` export. The real, verified blockers are (1) sm-lab's transitive `@scure/bip39`→`@noble/hashes` subpath mismatch under strict Node-ESM `exports` enforcement, (2) `moduleResolution: node` not seeing sm-lab's `.d.mts`/exports-only types, (3) `prool@0.2.10` having no `prool/instances` export (use `Instance.anvil` from top-level `prool`). Tasks 1 (gate), 4 (prool) and Global Constraints were updated; the service code in Tasks 2–3 was already ESM-correct (static `import`) and is unchanged. Blockers 1 & 2 are being fixed upstream in sm-lab.
- **Spec coverage:** deps ✓ (T1), keys ✓ (T2), fork actions + return values ✓ (T3), receipts addresses come via `connect()` defaults ✓ (T3), node lifecycle CI/prool + local BYO ✓ (T4), wallet handlers unchanged-by-design ✓ (T3 ctor updates only), CI workflow ✓ (T6), `test:setup` shrink ✓ (T2+T6), docs ✓ (T7). Phase A does NOT touch CL/IPFS mocks (Phase B) or workers (Phase C).
- **Pinning:** `pinningConfigured()` guard in `setGateAddrs`/`reportRewards` replicates today's no-PINATA CI (fake CIDs) and transparently upgrades when Phase B sets `IPFS_API_URL`.
- **Units:** service keeps ETH-string amounts at the boundary (`addBond(noId, '2')` call sites) and converts via `parseEther`; `withdrawKey` exitBalance changed from wei-string default (`'32000000000000000000'`) to ETH-string `'32'` — zero call sites, documented here.
- **Async ripple:** only `generateKeys` changes sync→async; `yarn types` is the completeness gate for the sweep.
- **Known risk:** receipts `addresses.hoodi.cm` must match the deployed hoodi CM suite the fork is taken from. The infra smoke (T5) catches a mismatch immediately (`connect()`/reads fail).
