# sm-lab + prool test infrastructure — design

**Date**: 2026-07-16
**Status**: approved (design), pending implementation plan
**Scope**: all 3 phases, both suites (`tests/cm-widget`, `tests/csm-widget`)

## Problem

The e2e fork infrastructure hand-rolls everything `@sm-lab/*` was built to replace:

- `ForkActionsService` shells out to `just` recipes in a local `staking-modules`
  checkout (`JUST_DIR`), requiring a full Foundry install and a contracts build in CI.
- `KeysGeneratorService` shells out to a platform-specific `eth-staking-smith` binary
  downloaded by `tests/scripts/set_up_keys_generator.sh`.
- Contract addresses come from ad-hoc devnet JSON parsing (`parseDevnetAddresses`).
- The fork node is started by `@lidofinance/wallets-testing-nodes` in CI only and torn
  down with `pkill -x anvil`.
- One shared anvil fork forces `workers: 1, fullyParallel: false` (1h CI cap).
- No CL API control and no IPFS control: oracle/rewards/strikes/validator-status flows
  are untested or pinned to whatever the fork block contained. Preset accounts use
  random mnemonics per run — failures are not reproducible.

## Solution overview

Adopt the published `@sm-lab/*` packages (recipes, keys, receipts, cl, ipfs) plus
`prool` in three stacking phases:

| Phase | Theme            | Outcome                                                                                               |
| ----- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| A     | Toolchain swap   | No Foundry toolchain (except `anvil`), no contracts checkout, no key binary; in-process typed recipes |
| B     | Offline test bed | CL + IPFS mocks; rewards/strikes/validator-status coverage becomes writable                           |
| C     | Parallel workers | Per-worker anvil via prool pool; `fullyParallel` in CI; deterministic presets                         |

Decisions locked with the user:

- All 3 phases, CM and CSM.
- **Local flow stays prool-free**: bring-your-own fork on `:8545`, `workers: 1`.
  prool owns the node lifecycle in CI only.
- CL/IPFS mocks start **in-process** (library import) from `globalSetup`; if ESM
  loading inside Playwright fails, fall back to spawning `npx @sm-lab/cl serve` /
  `npx @sm-lab/ipfs serve` child processes behind the same lifecycle wrapper.
- `@sm-lab/*` are published on npm — consume normally (no `file:`/workspace deps).

## Current architecture facts (verified)

- Browser RPC already flows through an interception seam: `rpcUrlToMock`
  (`.*/api/rpc\?chainId=…`) redirects the widget's `/api/rpc` calls to the fork.
  Per-worker routing in phase C is a parameterization of this seam.
- CL API is consumed via the stand's Next.js proxy `pages/api/cl/[[...method]].ts`
  (`CL_API_URLS_*` server env) — browser requests to `/api/cl/*` are interceptable
  the same way.
- IPFS gateways are browser-direct fetches, configurable per user via
  `savedUserConfig.ipfsGateways` (localStorage, QA config form) — interceptable or
  seedable via `storageState`.
- All Playwright fixtures in `test.fixture.ts` are already worker-scoped.
- CI (`.github/workflows/e2e-tests.yml`) fork mode: checks out `staking-modules`,
  installs `just` + Foundry, builds contracts, downloads the keys binary, runs the
  suite against a remote stand with a local anvil fork.

## Phase A — toolchain swap

No test-spec rewrites; service internals only.

**Dependencies**: add devDependencies `@sm-lab/recipes`, `@sm-lab/keys`,
`@sm-lab/receipts`, `prool`. Remove `@lidofinance/wallets-testing-nodes` usage for
node lifecycle (package may remain for other exports until fully unused).

**`tests/shared/services/forkActions.service.ts`** — keep the public API (specs
untouched); internals become in-process recipe calls:

- Lazy `connect({ module, rpcUrl })` on first use; `module` (`'cm' | 'csm'`) comes
  from the suite config, `rpcUrl` from the existing node config.
- Each method wraps its recipe in `test.step` (keep the `step` injection for
  globalSetup use).
- Delete `cwd`/`JUST_DIR`, Justfile probing, `execFile` plumbing, stdout parsing.
- Recipes return data (`addKeys` → pubkeys, `operatorInfo` → typed struct); extend
  method signatures where callers currently re-derive this.

**`tests/shared/services/keysGenerator.service.ts`** — reimplement over
`@sm-lab/keys` (pure TS): same `DepositKey` output shape, `--type 0x02`
(compounding) when `isCM`, mnemonic parameter for reproducibility. Delete
`tests/scripts/set_up_keys_generator.sh` and the `keys-generator-bin` path.

**Addresses** — recipes' `connect()` resolves addresses from `@sm-lab/receipts`
(`addresses.hoodi.{cm,csm}`, protocol block from `LidoLocator`). Keep
`DEVNET_ADDRESSES_FILE_PATH` + `parseDevnetAddresses` as the devnet-stand escape
hatch.

**Node lifecycle (CI)** — in `globalSetup`, when `process.env.CI && USE_FORK`:
`Instance.anvil({ forkUrl, mnemonic })` from prool, `.start()`; keep the existing
`warmUpForkedNode` callback. `globalTeardown` calls `.stop()` — delete the
`pkill -x anvil` path. Local flow unchanged (BYO fork, globalSetup skips node start).

**`WalletStateService` handlers** (`withOperator`/`withGroup`/`withKeys`/
`withDeposit`) — swap `fork.run(...)` internals for recipe calls. Preset model
itself unchanged in this phase.

**CI workflow** — remove: staking-modules checkout, `setup-just`, contracts
`yarn install --immutable`, `just deps && just build`, keys-binary download.
Keep `foundry-toolchain` solely for the `anvil` binary (prool spawns it).
`test:setup` shrinks to `npx playwright install chromium`; delete
`tests/scripts/install_foundry.sh` and the `test:setup:fork` script.

## Phase B — offline test bed (CL + IPFS)

**Startup** — `globalSetup` starts both mocks in-process:
`import { startServer } from '@sm-lab/cl'` (port 5052) and the `@sm-lab/ipfs`
equivalent (port 5001). Wrap both behind a small lifecycle module
(`tests/shared/services/mocks.lifecycle.ts`) exposing `start()`/`stop()` so the
npx-child-process fallback is a drop-in swap. `globalTeardown` stops them.

**Coherence with reality**:

- `sm-cl` runs with `upstream` = real testnet CL (proxy-and-cache): pubkeys not
  authored by a test still resolve.
- `sm-ipfs` gateway MISS proxies to a real upstream gateway: historical CIDs frozen
  at the fork block still load; freshly pinned content gets deterministic local CIDs.

**Routing (browser)** — extend the interception layer to three surfaces:

| Surface         | Pattern                 | Target                             |
| --------------- | ----------------------- | ---------------------------------- |
| EL RPC (exists) | `.*/api/rpc\?chainId=…` | anvil fork                         |
| CL (new)        | `.*/api/cl/.*`          | `http://127.0.0.1:5052/…`          |
| IPFS (new)      | configured gateway URLs | `http://127.0.0.1:5001/ipfs/{cid}` |

Fallback for IPFS if interception is awkward: seed `savedUserConfig.ipfsGateways`
via `storageState`.

**Recipes wiring** — pass `clMockUrl` (`CL_MOCK_URL`) into the recipes context and
set `IPFS_API_URL` so `clActivate`, `withdrawKey`, `setGateAddrs`, `make-rewards`
keep EL/CL/IPFS in sync. Test-side SDK clients point at the mocks directly.

**New coverage unlocked** (write as part of this phase):

1. Rewards claim against a freshly built + pinned rewards tree (`make-rewards`).
2. Strikes display and penalties (strikes tree pinned to sm-ipfs).
3. Validator status UI: active / exited / withdrawn / slashed via `sm-cl` admin API.
4. Gate address-tree updates: ICS `VettedGate` and CM curated gates
   (`setGateAddrs` + apply flows).

## Phase C — parallel isolated workers (CI)

**Pool** — `globalSetup` (CI) switches from a single `Instance.anvil()` to
`Server.create({ instance: Instance.anvil({ forkUrl }) })`; workers reach their
instance at `http://127.0.0.1:8545/{workerInfo.parallelIndex}`.

**Fixtures** — the worker-scoped fork RPC URL becomes a fixture derived from
`parallelIndex`; `rpcUrlToMock` interception, `cmSDK`/`csmSDK`, `evmNode`, and
`forkActionService` all consume it. Local (no prool): the fixture returns the BYO
`:8545` URL and workers stay at 1.

**Per-worker state seeding**:

- Fast path: seed worker 0's instance once (presets + seed recipes),
  `anvil_dumpState`, then `anvil_loadState` into sibling instances.
- Fallback (if dump/load proves unreliable on forked state): run
  `seedCm({ seed: parallelIndex })` / handler-composed CSM seeding per worker.
- Preset accounts move from `globalSetup` into a worker-scoped fixture with
  **deterministic** mnemonics (derived from preset name + worker index) — this also
  makes failures reproducible everywhere, local included.

**Mock sharing** — one `sm-cl` for all workers (per-worker deterministic pubkeys
are naturally namespaced); one `sm-ipfs` (content-addressed, nothing to namespace).

**Config flip (CI)** — `fullyParallel: true`, `workers: N` (start with 4; tune).
Snapshot/revert stays as per-describe isolation _within_ a worker. Local default
stays `workers: 1`.

## Risks & mitigations

| Risk                                                                                   | Mitigation                                                                                           |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@sm-lab/*` are ESM-only (tsdown); Playwright's TS loader may refuse in-process import | npx child-process fallback (decided)                                                                 |
| prool requires the `anvil` binary                                                      | CI keeps `foundry-toolchain`; local BYO fork already implies anvil                                   |
| `seedCsm` parity — `seedCm` exists, CSM one-call seeding may not                       | CSM presets stay on handler-composed recipes until sm-lab grows the recipe                           |
| `anvil_dumpState`/`loadState` on forked state may not carry fork-fetched storage       | validate first; fall back to per-worker recipe seeding                                               |
| Receipts snapshot drift vs the deployed testnet contracts                              | receipts are versioned; pin and bump deliberately; `DEVNET_ADDRESSES_FILE_PATH` escape hatch remains |

## Success criteria

- **A**: fork e2e green in CI with no `staking-modules` checkout, no `just`, no
  `forge`/`cast`, no keys binary; `test:setup` = Playwright install only.
- **B**: the four new coverage areas have green specs running fully against local
  mocks; no test depends on live CL/IPFS freshness.
- **C**: CI wall-clock drops materially (target ≥ 2× on the fork suites);
  re-running a failed test reproduces state (deterministic seeds).

## Out of scope

- Devnet/preview/prod stand flows (non-fork) — untouched.
- sm-lab docker-compose bed — not used by this repo's CI (in-process/npx instead).
- Migrating unit tests or the Jest setup.
