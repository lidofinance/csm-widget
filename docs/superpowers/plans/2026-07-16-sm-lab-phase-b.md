# sm-lab Phase B (Offline Test Bed — CL + IPFS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add in-process `@sm-lab/cl` (Beacon/CL) and `@sm-lab/ipfs` mock servers to the e2e fork bed, route the widget's CL + IPFS browser traffic to them, thread the mocks into the recipes context, and unlock 4 new coverage areas (rewards claim, strikes/penalties, validator status, gate address-tree updates).

**Architecture:** A single lifecycle module (`mocks.lifecycle.ts`, sibling to Phase A's `forkNode.service.ts`) starts/stops both mock servers in-process from `globalSetup`/`globalTeardown` whenever `USE_FORK` (both CI and local — the offline bed replaces reliance on live CL/IPFS). `ForkActionsService` gains `clMockUrl` on its `recipes.connect()` and sets `IPFS_API_URL` so `make-rewards`/`setGateAddrs`/`clActivate`/`withdraw` keep EL/CL/IPFS coherent. The browser is pointed at the mocks by extending the existing `page.route` interception seam (`/api/cl/*` → cl-mock) and by seeding `savedUserConfig.ipfsGateways` (→ ipfs-mock). Both mocks proxy-and-cache a real upstream on MISS, so historical CL pubkeys / frozen CIDs still resolve.

**Tech Stack:** `@sm-lab/cl@^1.1.0`, `@sm-lab/ipfs@^1.3.0`, `@sm-lab/recipes@^0.4.3`, Playwright 1.61, viem, Hono node-server handles, Node 24. (Phase B deps already installed + committed: `202486b7`.)

**Spec:** `docs/superpowers/specs/2026-07-16-sm-lab-test-infra-design.md` (Phase B section).

## Global Constraints

- **ESM reality (from Phase A — non-negotiable):** the suite runs under Node's native ESM loader (`type: module`, Playwright 1.61). Use static `import` from `@sm-lab/*`; NEVER `require()`/dynamic-import them. Node strictly enforces `exports` maps.
- **Verify APIs against the INSTALLED types, not this plan's prose.** The code snippets below are the intended shape derived from `@sm-lab/cl@1.1.0` / `@sm-lab/ipfs@1.3.0` / `@sm-lab/recipes@0.4.3`. If `yarn types` disagrees, read the real `.d.mts` (`node_modules/@sm-lab/{cl,ipfs,recipes}/dist/index.d.mts`) and adapt to the actual signature; record any deviation in the task report. Do NOT invent a symbol that isn't exported.
- **Type resolution:** `tsconfig` stays `moduleResolution: node` (bundler was rejected in Phase A — 388 errors across `@lidofinance/*`). `@sm-lab/cl` and `@sm-lab/ipfs` each expose a single `.` export with a top-level `types`, so they resolve under node10 with NO `paths` shim. Only add a `tsconfig` `paths` entry if a NEW subpath import fails to resolve (mirror the existing `@sm-lab/recipes/cm` shim).
- **Mock lifecycle gating:** the anvil node stays CI-only (`process.env.CI`, Phase A). The CL/IPFS mocks start whenever `USE_FORK === 'true'` (CI AND local) — the offline bed is the point; there is no bring-your-own CL/IPFS.
- **Pinning parity → real local IPFS:** Phase A passed fake CIDs when no IPFS endpoint was configured (`pinningConfigured()`). In Phase B, when the ipfs-mock is running, `IPFS_API_URL` IS set, so `pinningConfigured()` returns true and recipes pin to the local mock (real CIDs, resolvable via the browser gateway route). Do not regress the no-IPFS fallback for non-fork flows.
- **Do NOT touch** `parseDevnetAddresses` / `DEVNET_ADDRESSES_FILE_PATH` (devnet escape hatch).
- **Runtime verification is CI-gated for the coverage specs.** The 4 coverage specs (Tasks 8–11) require a live anvil fork + a running widget + the mocks routed together — not available in local dev here. Author them (mirroring existing `@forked` specs), gate them behind `@forked`, verify `yarn types` + `yarn lint`, and mark the live run deferred-to-CI (as Phase A's `infraSmoke.spec.ts` did). Do NOT fabricate a passing run. The mock lifecycle (Task 2) and the mock config/wiring ARE locally verifiable and must be smoke-tested.
- `type` not `interface`; function expressions only; no `console.log` (use `console.info`/`warn`/`error`); unused vars prefixed `_`; 2-space indent, single quotes, trailing commas.
- Conventional commits; commit UNSIGNED: `git commit --no-gpg-sign`. No Claude co-author. Run `yarn lint:fix` after each task; `yarn types` must pass at every commit.

## File Structure

| Action | Path                                                                                    | Responsibility                                             |
| ------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Create | `tests/shared/services/mocks.lifecycle.ts`                                              | start/stop cl+ipfs mock servers (in-process singleton)     |
| Modify | `tests/cm-widget/config/configs/base.config.ts`                                         | `StandConfig.mockConfig` type (cl/ipfs host/port/upstream) |
| Modify | `tests/cm-widget/config/configs/{testnet,prod}.config.ts`, csm equivalents              | mock host/port/upstream values + CL/IPFS route patterns    |
| Modify | `tests/cm-widget/config/globalSetup.ts`, `tests/csm-widget/config/globalSetup.ts`       | start mocks (USE_FORK), set `IPFS_API_URL`/`CL_MOCK_URL`   |
| Modify | `tests/cm-widget/config/globalTeardown.ts`, `tests/csm-widget/config/globalTeardown.ts` | stop mocks                                                 |
| Modify | `tests/shared/services/forkActions.service.ts`                                          | `clMockUrl` on `connect()`; pin to local ipfs              |
| Modify | `tests/cm-widget/tests/test.fixture.ts`, `tests/csm-widget/tests/test.fixture.ts`       | CL route + IPFS gateway seeding on the page/context        |
| Create | `tests/cm-widget/tests/coverage/rewardsClaim.spec.ts` (+ csm)                           | rewards-claim coverage (`@forked`)                         |
| Create | `tests/cm-widget/tests/coverage/strikes.spec.ts`                                        | strikes/penalties coverage (`@forked`)                     |
| Create | `tests/cm-widget/tests/coverage/validatorStatus.spec.ts`                                | validator status via cl-mock (`@forked`)                   |
| Create | `tests/cm-widget/tests/coverage/gateTree.spec.ts`                                       | ICS/curated gate address-tree updates (`@forked`)          |

Exact per-suite paths (cm vs csm) and PageObject entry points are resolved per task by reading the mirror specs named in each task.

---

### Task 1: Mock config surface

**Files:**

- Modify: `tests/cm-widget/config/configs/base.config.ts` (StandConfig type)
- Modify: `tests/cm-widget/config/configs/testnet.config.ts`, `prod.config.ts` (+ csm equivalents)

**Interfaces:**

- Produces: `StandConfig.mockConfig: { clHost: string; clPort: number; clUpstreamUrl?: string; ipfsHost: string; ipfsPort: number; ipfsUpstreamGateway?: string }` and a way to build `clMockUrl` (`http://${clHost}:${clPort}`) + `ipfsApiUrl` (`http://${ipfsHost}:${ipfsPort}`) consumed by Tasks 2–5. CL/IPFS browser route patterns added to the existing `rpcUrlToMock`-style config block.

- [ ] **Step 1: Read the current config shape**

Read `tests/cm-widget/config/configs/base.config.ts` (the `StandConfig` type and `WidgetConfig` class, ~lines 11–34) and one concrete config (`testnet.config.ts`) to see how `nodeConfig` and `rpcUrlToMock` are set. Mirror that structure.

- [ ] **Step 2: Add `mockConfig` to `StandConfig`**

In `base.config.ts`, extend `StandConfig` with (defaults from `@sm-lab/cl` `DEFAULT_PORT=5052`, `@sm-lab/ipfs` `DEFAULT_PORT=5001`, `DEFAULT_HOST='127.0.0.1'`):

```typescript
export type MockConfig = {
  clHost: string;
  clPort: number;
  /** real testnet CL base URL the cl-mock proxies to on miss (from CL_API_URLS_* server env). */
  clUpstreamUrl?: string;
  ipfsHost: string;
  ipfsPort: number;
  /** real upstream IPFS gateway the ipfs-mock proxies to on miss. */
  ipfsUpstreamGateway?: string;
};
```

Add `mockConfig: MockConfig;` to `StandConfig` and `public mockConfig!: MockConfig;` to the config class.

- [ ] **Step 3: Populate values in `testnet.config.ts` / `prod.config.ts` (both suites)**

```typescript
mockConfig: {
  clHost: '127.0.0.1',
  clPort: 5052,
  clUpstreamUrl: process.env.CL_API_URLS_560048?.split(',')[0], // testnet=hoodi; prod.config uses CL_API_URLS_1. The repo's CL env is per-chain + comma-delimited (first=primary). NOT `CL_API_URL` (doesn't exist). undefined → mock serves authored-only.
  ipfsHost: '127.0.0.1',
  ipfsPort: 5001,
  ipfsUpstreamGateway: process.env.IPFS_UPSTREAM_GATEWAY,
},
```

Add the browser route patterns next to `rpcUrlToMock` in the same config block:

```typescript
clUrlToMock: [`.*/api/cl/.*`],
```

(IPFS is routed via gateway seeding, not a URL pattern — see Task 6.)

- [ ] **Step 4: Type-check + commit**

Run `yarn types` (expect 0 errors), `yarn lint:fix`.

```bash
git add tests
git commit --no-gpg-sign -m "feat(tests): add CL/IPFS mock config to StandConfig"
```

---

### Task 2: Mock lifecycle service

**Files:**

- Create: `tests/shared/services/mocks.lifecycle.ts`

**Interfaces:**

- Consumes: `startServer` from `@sm-lab/cl` (`startServer(port, host, { upstreamUrl? })`) and `@sm-lab/ipfs` (`startServer({ port?, host?, gateway? })`); both return a node-server handle with `.close()`.
- Produces: `startMocks(opts: MocksOptions): Promise<void>`, `stopMocks(): Promise<void>` — module-level singletons (mirror `forkNode.service.ts`). `MocksOptions = { clHost: string; clPort: number; clUpstreamUrl?: string; ipfsHost: string; ipfsPort: number; ipfsUpstreamGateway?: string }`.

- [ ] **Step 1: Read the sibling pattern**

Read `tests/shared/services/forkNode.service.ts` — copy its singleton/idempotent style (`let handle; if (handle) return;`), `console.info` logging, and export shape.

- [ ] **Step 2: Write the service**

VERIFY the two `startServer` signatures against `node_modules/@sm-lab/{cl,ipfs}/dist/index.d.mts` before finalizing (cl takes positional `(port, host, opts)`; ipfs takes a single options object). The returned handle's stop method is whatever `@hono/node-server`'s `serve()` returns — confirm it's `.close()` (Node http server) and adapt if it differs.

```typescript
import { startServer as startClServer } from '@sm-lab/cl';
import { startServer as startIpfsServer } from '@sm-lab/ipfs';

type ServerHandle = { close: (cb?: (err?: Error) => void) => void };

type MocksOptions = {
  clHost: string;
  clPort: number;
  clUpstreamUrl?: string;
  ipfsHost: string;
  ipfsPort: number;
  ipfsUpstreamGateway?: string;
};

let clHandle: ServerHandle | undefined;
let ipfsHandle: ServerHandle | undefined;

const closeHandle = (handle: ServerHandle): Promise<void> =>
  new Promise((resolve, reject) =>
    handle.close((err) => (err ? reject(err) : resolve())),
  );

/** Start the in-process CL + IPFS mocks (offline test bed). Idempotent. */
export const startMocks = async (options: MocksOptions): Promise<void> => {
  if (!clHandle) {
    clHandle = startClServer(options.clPort, options.clHost, {
      upstreamUrl: options.clUpstreamUrl,
    }) as unknown as ServerHandle;
    console.info(
      `[mocks] cl-mock listening on ${options.clHost}:${options.clPort}`,
    );
  }
  if (!ipfsHandle) {
    ipfsHandle = startIpfsServer({
      port: options.ipfsPort,
      host: options.ipfsHost,
      gateway: options.ipfsUpstreamGateway,
    }) as unknown as ServerHandle;
    console.info(
      `[mocks] ipfs-mock listening on ${options.ipfsHost}:${options.ipfsPort}`,
    );
  }
};

export const stopMocks = async (): Promise<void> => {
  if (clHandle) {
    await closeHandle(clHandle);
    clHandle = undefined;
    console.info('[mocks] cl-mock stopped');
  }
  if (ipfsHandle) {
    await closeHandle(ipfsHandle);
    ipfsHandle = undefined;
    console.info('[mocks] ipfs-mock stopped');
  }
};
```

- [ ] **Step 3: Local runtime smoke (this IS runnable without a fork)**

The mocks are standalone HTTP servers — verify they actually boot and serve:

```bash
node --input-type=module -e "
import { startMocks, stopMocks } from './tests/shared/services/mocks.lifecycle.ts';
" 2>/dev/null || true   # .ts not directly runnable; use the compiled probe below instead
```

Since raw `.ts` isn't node-runnable, smoke via the packages directly:

```bash
node --input-type=module -e "
const cl = await import('@sm-lab/cl'); const ipfs = await import('@sm-lab/ipfs');
const c = cl.startServer(5052, '127.0.0.1', {}); const i = ipfs.startServer({ port: 5001, host: '127.0.0.1' });
await new Promise(r => setTimeout(r, 300));
const clR = await fetch('http://127.0.0.1:5052/eth/v1/node/health').then(r=>r.status).catch(e=>'ERR '+e.message);
const ipR = await fetch('http://127.0.0.1:5001/api/v0/version', {method:'POST'}).then(r=>r.status).catch(async()=> (await fetch('http://127.0.0.1:5001/').then(r=>r.status).catch(e=>'ERR '+e.message)));
console.info('cl health:', clR, ' ipfs:', ipR);
c.close(); i.close();
"
```

Expected: both servers respond (any HTTP status, not `ERR`). Adjust the probe paths to whatever the mocks' health/base routes actually are (read `registerBeaconRoutes`/`registerGatewayRoutes` exports if unsure). Record the actual working probe in the report. If a port is busy locally, that's environmental — note it.

- [ ] **Step 4: Type-check, lint, commit**

```bash
yarn types && yarn lint:fix
git add tests/shared/services/mocks.lifecycle.ts
git commit --no-gpg-sign -m "feat(tests): in-process CL + IPFS mock lifecycle service"
```

---

### Task 3: Wire mocks into globalSetup / globalTeardown

**Files:**

- Modify: `tests/cm-widget/config/globalSetup.ts`, `tests/csm-widget/config/globalSetup.ts`
- Modify: `tests/cm-widget/config/globalTeardown.ts`, `tests/csm-widget/config/globalTeardown.ts`

**Interfaces:**

- Consumes: `startMocks`/`stopMocks` (Task 2), `widgetFullConfig.standConfig.mockConfig` (Task 1).
- Produces: `CL_MOCK_URL` and `IPFS_API_URL` set in `process.env` for the recipes wiring (Task 4) BEFORE any `ForkActionsService` connects.

- [ ] **Step 1: Read the current globalSetup/teardown (post-Phase-A)**

Read all four files. Note the `USE_FORK` guard and where `startForkNode`/`assertForkReachable` sit — mock startup goes AFTER the node is reachable, BEFORE `warmUpForkedNode`/`setupPresetAccounts` (so warm-up seeding can already pin to the local ipfs).

- [ ] **Step 2: Start mocks in both globalSetup files**

Add after `assertForkReachable(forkRpcURL)` and before warm-up:

```typescript
import { startMocks } from 'tests/shared/services/mocks.lifecycle';
// ...
const { mockConfig } = widgetFullConfig.standConfig;
await startMocks(mockConfig);
process.env.CL_MOCK_URL = `http://${mockConfig.clHost}:${mockConfig.clPort}`;
process.env.IPFS_API_URL = `http://${mockConfig.ipfsHost}:${mockConfig.ipfsPort}`;
```

Note: mocks start whenever `USE_FORK === 'true'` (the existing early-return guard already handles the non-fork case — mocks live inside it, so both CI and local fork runs get them).

- [ ] **Step 3: Stop mocks in both globalTeardown files**

```typescript
import { stopMocks } from 'tests/shared/services/mocks.lifecycle';
// inside the teardown, alongside stopForkNode():
await stopMocks();
```

(cm teardown gates node stop on `process.env.CI`; `stopMocks()` should run unconditionally when `USE_FORK`, mirroring startup.)

- [ ] **Step 4: Type-check, lint, commit**

```bash
yarn types && yarn lint:fix
git add tests
git commit --no-gpg-sign -m "feat(tests): start/stop CL+IPFS mocks in global setup/teardown"
```

---

### Task 4: Thread mocks into the recipes context

**Files:**

- Modify: `tests/shared/services/forkActions.service.ts`

**Interfaces:**

- Consumes: `recipes.connect({ module, rpcUrl, clMockUrl? })` (verified: `ConnectOptions` has optional `clMockUrl`); `process.env.CL_MOCK_URL`, `process.env.IPFS_API_URL` (Task 3).
- Produces: a `ctx()` that carries `clMockUrl` so `clActivate`/`withdraw`/`exitRequest` reflect on the cl-mock, and pinning (`make-rewards`/`setGateAddrs`) targets the real local ipfs.

- [ ] **Step 1: Pass `clMockUrl` on connect**

In `ForkActionsService.ctx()`, add `clMockUrl: process.env.CL_MOCK_URL` to the `recipes.connect({ ... })` object (leave `module`/`rpcUrl` as-is). `connect` ignores an `undefined` `clMockUrl`, so non-mock runs are unaffected.

- [ ] **Step 2: Let pinning use the real local ipfs**

`pinningConfigured()` already returns true when `IPFS_API_URL` is set (Task 3 sets it). So `reportRewards()` and `setGateAddrs()` will pin to the local mock (real CIDs) automatically — REMOVE nothing, but VERIFY the fake-CID branches are now bypassed when mocks run and still used when they don't. Add a one-line comment noting `IPFS_API_URL` is set by globalSetup when the ipfs-mock runs.

- [ ] **Step 3: Type-check, lint, commit**

```bash
yarn types && yarn lint:fix
git add tests/shared/services/forkActions.service.ts
git commit --no-gpg-sign -m "feat(tests): thread cl-mock + ipfs pinning into recipes context"
```

---

### Task 5: Browser CL routing

**Files:**

- Modify: `tests/cm-widget/tests/test.fixture.ts`, `tests/csm-widget/tests/test.fixture.ts`

**Interfaces:**

- Consumes: `clUrlToMock` config pattern (Task 1), `CL_MOCK_URL` (Task 3).
- Produces: the widget's browser `/api/cl/*` requests are redirected to the cl-mock in fork runs.

- [ ] **Step 1: Find the existing EL route installation**

Read `test.fixture.ts` (both suites) and find where the page/context is set up with the fork RPC route (the `rpcUrlToMock` seam — likely inside `BrowserService`/`browserWithWallet` or a `page` fixture). Mirror it for CL.

- [ ] **Step 2: Install a CL route in the page fixture**

Add a `page.route` that redirects `/api/cl/*` to the cl-mock, preserving the path after `/api/cl/`:

```typescript
if (process.env.USE_FORK === 'true' && process.env.CL_MOCK_URL) {
  await page.route(/\/api\/cl\/(.*)/, async (route) => {
    const url = new URL(route.request().url());
    const target = `${process.env.CL_MOCK_URL}${url.pathname.replace('/api/cl', '')}${url.search}`;
    await route.continue({ url: target });
  });
}
```

Confirm the exact `/api/cl` prefix and CL path shape against `pages/api/cl/[[...method]].ts`. If `route.continue({ url })` cross-origin redirect is disallowed, fall back to `route.fetch()` + `route.fulfill()`.

- [ ] **Step 3: Type-check, lint, commit** (runtime verified in CI; note deferral in report)

```bash
yarn types && yarn lint:fix
git add tests
git commit --no-gpg-sign -m "feat(tests): route browser CL calls to the cl-mock in fork runs"
```

---

### Task 6: Browser IPFS gateway routing

**Files:**

- Modify: `tests/cm-widget/tests/test.fixture.ts`, `tests/csm-widget/tests/test.fixture.ts`

**Interfaces:**

- Consumes: `config/user-config/saved-config.ts` (`ipfsGateways: string[]`), `IPFS_API_URL` (Task 3).
- Produces: the widget resolves IPFS content through the local ipfs-mock in fork runs.

- [ ] **Step 1: Read the ipfsGateways config path**

Read `config/user-config/saved-config.ts` and `config/user-config/utils.ts` — confirm the localStorage key/shape for `savedUserConfig.ipfsGateways` (default `[]`).

- [ ] **Step 2: Seed the gateway via storageState / addInitScript**

In the page/context fixture, when `USE_FORK`, seed the saved user config so the browser uses the ipfs-mock gateway:

```typescript
if (process.env.USE_FORK === 'true' && process.env.IPFS_API_URL) {
  await context.addInitScript((gw) => {
    const key = 'SAVED_USER_CONFIG'; // confirm exact key from saved-config.ts
    const cur = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...cur, ipfsGateways: [gw] }));
  }, `${process.env.IPFS_API_URL}/ipfs/`);
}
```

Confirm the exact localStorage key and the gateway URL shape the widget expects (`.../ipfs/{cid}` vs `.../ipfs/`) from `saved-config.ts`/`utils.ts`. If a `page.route` on the gateway URL is cleaner, that is an acceptable alternative.

- [ ] **Step 3: Type-check, lint, commit** (runtime verified in CI)

```bash
yarn types && yarn lint:fix
git add tests
git commit --no-gpg-sign -m "feat(tests): seed ipfs-mock gateway for browser IPFS reads in fork runs"
```

---

### Task 7: Infra coherence smoke (fork-tagged)

**Files:**

- Create: `tests/cm-widget/tests/coverage/mocksSmoke.spec.ts`

**Interfaces:**

- Consumes: `forkActionService`, `evmNode`, `widgetService`, `Tags.forked`.
- Produces: a `@forked` spec proving cl+ipfs+recipes are coherent (make-rewards pins to local ipfs and resolves; a cl-mock validator status reads back). Executable verification for Tasks 2–6 (CI).

- [ ] **Step 1: Write the spec** mirroring `tests/cm-widget/tests/infraSmoke.spec.ts` (Phase A). Snapshot/revert in `beforeAll`/`afterAll`; assert `forkActionService.reportRewards()` returns a report with resolvable `treeCid` (not a `fork-*` fake CID), and that a validator status set via a recipe reflects on the cl-mock. Real assertions only.
- [ ] **Step 2:** `yarn types` + `yarn lint:fix`. Live run deferred to CI (no fork/stand locally) — state so; do not fake.
- [ ] **Step 3: Commit** `test(cm): sm-lab offline-bed infra smoke spec`.

---

### Task 8: Coverage — rewards claim against a pinned tree

**Files:**

- Create: `tests/cm-widget/tests/coverage/rewardsClaim.spec.ts` (+ csm equivalent if the flow differs)

**Interfaces:** Consumes `forkActionService.reportRewards()` (make + submit, now pinning to local ipfs), the rewards/claim PageObject.

- [ ] **Step 1:** Find the closest existing rewards/claim spec (`grep -rl "reportRewards\|claim" tests/cm-widget/tests`) and its PageObject entry (`widgetService.*Page`). Mirror its `beforeAll` open + snapshot pattern.
- [ ] **Step 2:** Write a `@forked` spec: `reportRewards()` → open claim page → assert claimable amount matches the SDK value (per CLAUDE.md amount-assertion rules: compare to `cmSDK.getRewards(noId).available` via `formatEther`, tolerance per display precision) → claim → assert success. Real assertions, `test.step` structure.
- [ ] **Step 3:** `yarn types` + `yarn lint:fix`. Live run deferred-to-CI (state it). Commit `test(cm): rewards claim against pinned rewards tree`.

---

### Task 9: Coverage — strikes display & penalties

**Files:**

- Create: `tests/cm-widget/tests/coverage/strikes.spec.ts`

- [ ] **Step 1:** Find the strikes/penalty PageObject + any existing penalty spec to mirror.
- [ ] **Step 2:** Write a `@forked` spec: seed a strikes tree (pinned to ipfs-mock via the relevant recipe) + `reportPenalty`/`settlePenalty` → assert the strikes UI + penalty amounts render (compare against SDK values). Real assertions.
- [ ] **Step 3:** `yarn types` + `yarn lint:fix`. Deferred-to-CI. Commit `test(cm): strikes display and penalties`.

---

### Task 10: Coverage — validator status via cl-mock

**Files:**

- Create: `tests/cm-widget/tests/coverage/validatorStatus.spec.ts`

- [ ] **Step 1:** Find the validator/keys status PageObject. The cl-mock admin API sets status (`setClValidator(clMockUrl, ...)` / `@sm-lab/cl` `ValidatorStore`/`buildValidator`, statuses in `VALIDATOR_STATUSES`).
- [ ] **Step 2:** Write a `@forked` spec parameterized over active / exited / withdrawn / slashed: set the validator status via the recipe/cl-mock, reload, assert the keys UI reflects each status. Real assertions per status.
- [ ] **Step 3:** `yarn types` + `yarn lint:fix`. Deferred-to-CI. Commit `test(cm): validator status UI via cl-mock`.

---

### Task 11: Coverage — gate address-tree updates (ICS + curated)

**Files:**

- Create: `tests/cm-widget/tests/coverage/gateTree.spec.ts`

- [ ] **Step 1:** Find the ICS `VettedGate` apply flow spec + the CM curated-gate flow (`grep -rl "setGateAddrs\|VettedGate\|curated" tests`). Mirror them.
- [ ] **Step 2:** Write a `@forked` spec: `forkActionService.setGateAddrs(selector, address)` (now pinning the tree to ipfs-mock, real CID) → open the apply flow → assert the address is eligible / the gate resolves. Cover one ICS gate and one curated gate. Real assertions.
- [ ] **Step 3:** `yarn types` + `yarn lint:fix`. Deferred-to-CI. Commit `test(cm): gate address-tree updates (ICS + curated)`.

---

## Self-Review Notes (for the executor)

- **Spec coverage:** mock startup in-process ✓ (T2–T3), CL routing ✓ (T5), IPFS routing ✓ (T6), recipes wiring (`clMockUrl` + `IPFS_API_URL`) ✓ (T4), pinning→local ipfs ✓ (T4 + Global Constraints), 4 coverage areas ✓ (T8–T11), infra smoke ✓ (T7). Phase B does NOT touch parallel workers (Phase C).
- **Verifiability split:** Tasks 1–4 + 7's compile are type-verifiable; Task 2 has a real local runtime smoke (standalone servers). Tasks 5–6 and 7–11's live behavior are CI-gated (need running widget + fork + mocks). This is called out per task; the executor must NOT fake fork runs.
- **API-drift guard:** every `@sm-lab/*` call is "intended shape" — the executor verifies against `dist/index.d.mts` and reports deviations (same discipline that found Phase A's prool `Server.create` mistake).
- **Local-vs-CI mock gating:** mocks run for ALL `USE_FORK` runs (unlike the CI-only node), because there is no BYO CL/IPFS. Confirm the `globalSetup` guard placement reflects this.
- **Pinning regression watch:** non-fork flows must still get the fake-CID fallback (`pinningConfigured()` false when `IPFS_API_URL` unset). Task 4 must not break that.
