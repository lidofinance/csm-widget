# Lido Community Staking Module Widget

A widget for participating in Lido CSM based on [Lido Frontend Template](https://github.com/lidofinance/lido-frontend-template).

Lido Community Staking Module (CSM) is a permissionless module allowing community stakers to operate Ethereum validators with lower entry costs. Stakers provide stETH bonds, serving as security collateral, and receive rewards in the form of bond rebase and staking rewards (including execution layer rewards), which are socialized across Lido’s staking modules.

More on CSM in the [docs](https://docs.lido.fi/staking-modules/csm/intro).

## Prerequisites

- Node.js v24 (`>=24.0.0 <25.0.0`)
- Yarn package manager v1

This project requires an `.env` file which is distributed via private communication channels. A sample can be found in `.env.example`

## Development

Step 1. Copy the contents of `.env.example` to `.env.local`

```bash
cp .env.example .env.local
```

Step 2. Fill out the `.env.local`. You will need to provide RPC provider urls and CL API urls with keys included.

Step 3. Install dependencies

```bash
yarn install
```

Step 4. Start the development server

```bash
yarn dev               # CSM on :3000
PORT=3001 yarn dev:cm  # CM, can run next to CSM
```

`yarn dev` runs `server.mjs` in dev mode, so `/runtime/window-env.js` and `/api/*` behave as in production (there is no CSP header in dev).

Step 5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

Every page is a static shell prerendered at build time; the app renders in the browser and only `/api/*` runs per request. Env vars come in three groups:

- **Client, runtime.** `server.mjs` reads them on start (`config/client-env.mjs`) and serves them as `window.__env__` at `{BASE_PATH}/runtime/window-env.js`, loaded before the app bundle. Restart to apply, no rebuild: `DEFAULT_CHAIN`, `MAINTENANCE`, `IS_PROD`, `MATOMO_URL`, `WALLETCONNECT_PROJECT_ID`, `KEYS_API_URL`, `FEES_MONITORING_API_URL`, `SURVEYS_API_URL`, `IPFS_GATEWAYS`, `VALIDATION_SERVICE_BASE_PATH` (only whether it is set), `DEVNET_ADDRESSES_FILE_PATH`.
- **Server, runtime.** `EL_RPC_URLS_*`, `CL_API_URLS_*`, `ETHSEER_*`, `CSP_*`, `RATE_LIMIT*`, `VALIDATION_SERVICE_BASE_PATH`, `VALIDATION_FILE_PATH`: read from `process.env` by `server.mjs` and the API routes only, never sent to the browser. `server.mjs` builds the `Content-Security-Policy` header from `CSP_*`.
- **Build time.** `MODULE` and `BASE_PATH` are inlined into the bundle (see below).

### Modules

`MODULE` (`csm` | `cm`, default `csm`) selects the module at build time. Each build goes to `.next/<module>` with its own title, meta tags, favicon and `manifest.json`.

- `yarn build` builds the current `MODULE`; `yarn build:all` builds both. The Docker image ships both.
- On start, `MODULE` picks which build `server.mjs` serves, so one image runs either module. Starting a module that was not built fails.
- `BASE_PATH` is build time as well (Next.js requirement): use the same value for build and start.

### Maintenance

`MAINTENANCE=true` (runtime, restart to apply) shows the maintenance screen on every route. Pages still answer `200`; `/api/*` keeps working.

### Automatic versioning

Note! This repo uses automatic versioning, please follow the [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/).

e.g.

```bash
git commit -m "fix: a bug in calculation"
git commit -m "feat: dark theme"
```

## Production

```bash
yarn build:all
MODULE=cm yarn start   # MODULE=csm is the default
```

## Running Tests

Unit tests need no env: `yarn test:unit` (vitest, `*.test.ts(x)` / `*.spec.ts(x)` outside `tests/`). The rest of this section is about the Playwright e2e suites.

Before running the test suite, create a file named `.env.local` in the project root and populate it with the following variables:

```dotenv
# Choose one: testnet, prod, staging, preview
STAND_TYPE=testnet

# Wallet environment
WALLET_SECRET_PHRASE=
WALLET_PASSWORD=
```

Replace each value as needed for your environment.

Install browser:

```sh
yarn playwright install chromium --with-deps
```

To execute the tests, run the suite for the module you want:

```sh
yarn test:csm:e2e   # CSM widget
yarn test:cm:e2e    # CM widget
```

Append `:ui` (`yarn test:csm:ui` / `yarn test:cm:ui`) to run Playwright in interactive UI mode. This loads your `.env.local` file and runs the configured test scripts.

### Local fork

Forked tests run against a local anvil fork started by `compose.yaml`. There is one
profile per network — `mainnet`, `hoodi` — so both forks can run side by side:

```sh
docker compose --env-file fork.env --profile hoodi up -d --wait   # start, waits until the fork answers
docker compose --env-file fork.env run --rm hoodi-url             # print the local and public URLs
docker compose --env-file fork.env --profile hoodi logs -f        # follow logs
docker compose --env-file fork.env --profile hoodi down           # stop and remove
docker compose --env-file fork.env ps                             # every running fork
```

Every module of a network (CSM, CSM_02, CM) is already deployed in that network,
so one fork serves them all — the module a command or a suite works with only
decides which contract addresses the calls go to.

`export COMPOSE_ENV_FILES=fork.env` once in your shell and the flag can be dropped.

The compose project is named `csm-widget-forks` and the containers are named
`hoodi-fork`, `mainnet-fork`, `ipfs` (each with its `-tunnel`), so they read the
same in `docker ps` and stay the same from any checkout of the repo — a second
worktree talks to the running forks instead of starting its own.

The fork is made from `EL_RPC_URLS_1` / `EL_RPC_URLS_560048` and funds the
`WALLET_SECRET_PHRASE` accounts, both taken from `.env.local`. Every fork also
gets a cloudflared quick tunnel, so it can be reached from outside — the `-url`
service prints that address.

The tests also need an IPFS node to pin merkle trees to. It has its own profile
and can be started once and left running next to any fork:

```sh
docker compose --env-file fork.env --profile ipfs up -d --wait
docker compose --env-file fork.env run --rm ipfs-url   # gateway URLs, local and public
```

It gets a tunnel of its own, so the gateway is reachable from outside. Only the
gateway — the API on 5001 is unauthenticated admin access to the node.

The ports live in [fork.env](./fork.env) — the only place they are written down.
The tests and the contract commands read the same file, so nothing has to be
switched by hand between forks (in CI they all use the plain 8545):

```sh
yarn fork csm hoodi addKeys 12 5   # hits the hoodi fork as CSM; `yarn fork help` lists every command
USE_FORK=true yarn test:cm:e2e     # hits the hoodi fork as CM (STAND_TYPE=testnet)
```

A fork is shared state: `evm_snapshot` / `evm_revert` cover the whole node, so
two suites running against the same fork at once will roll back each other's
setup. Run them one after another.

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.

Learn more about [App Release Flow](https://www.notion.so/App-Release-Flow-f8a3484deecb40cb9d8da4d82c1afe96).
