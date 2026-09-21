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
yarn dev
```

Step 5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

This project uses `publicRuntimeConfig` in the [next.config.mjs](./next.config.mjs) and `getServerSideProps` on the pages (function may be empty, but it forces Next.js to switch to Server-Side Rendering mode). This is necessary to quickly start the docker container without rebuilding the application.

Read more about [runtime configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration) and [automatic static optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)

### Automatic versioning

Note! This repo uses automatic versioning, please follow the [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/).

e.g.

```bash
git commit -m "fix: a bug in calculation"
git commit -m "feat: dark theme"
```

## Production

```bash
yarn build && yarn start
```

## Running Tests

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
profile per network and module — `mainnet-csm`, `mainnet-cm`, `hoodi-csm`,
`hoodi-cm` — so forks can run side by side:

```sh
docker compose --env-file fork.env --profile hoodi-cm up -d --wait   # start, waits until the fork answers
docker compose --env-file fork.env run --rm hoodi-cm-url             # print the local and public URLs
docker compose --env-file fork.env --profile hoodi-cm logs -f        # follow logs
docker compose --env-file fork.env --profile hoodi-cm down           # stop and remove
docker compose --env-file fork.env ps                                # every running fork
```

`export COMPOSE_ENV_FILES=fork.env` once in your shell and the flag can be dropped.

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
switched by hand between forks (in CI, where a job runs a single fork, they all
use the plain 8545):

```sh
yarn fork csm hoodi addKeys 12 5   # hits the hoodi-csm fork; `yarn fork help` lists every command
USE_FORK=true yarn test:cm:e2e     # hits the hoodi-cm fork (STAND_TYPE=testnet)
```

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.

Learn more about [App Release Flow](https://www.notion.so/App-Release-Flow-f8a3484deecb40cb9d8da4d82c1afe96).
