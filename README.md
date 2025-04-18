# Lido Community Staking Module Widget

A widget for participating in Lido CSM based on [Lido Frontend Template](https://github.com/lidofinance/lido-frontend-template).

Lido Community Staking Module (CSM) is a permissionless module allowing community stakers to operate Ethereum validators with lower entry costs. Stakers provide stETH bonds, serving as security collateral, and receive rewards in the form of bond rebase and staking rewards (including execution layer rewards), which are socialized across Lido’s staking modules.

More on CSM in the [docs](https://docs.lido.fi/staking-modules/csm/intro).

## Prerequisites

- Node.js v20+
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

This project uses `publicRuntimeConfig` in the [next.config.js](./next.config.js) and `getServerSideProps` on the pages (function may be empty, but it forces Next.js to switch to Server-Side Rendering mode). This is necessary to quickly start the docker container without rebuilding the application.

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

# RPC token
RPC_URL_TOKEN=
```

Replace each value as needed for your environment.

To execute the tests, simply run:

```sh
yarn test
```

This will load your .env.local file and run all configured test scripts.

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.

Learn more about [App Release Flow](https://www.notion.so/App-Release-Flow-f8a3484deecb40cb9d8da4d82c1afe96).
