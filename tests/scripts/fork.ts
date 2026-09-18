import { parseArgs } from 'node:util';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
import {
  COMMANDS,
  ForkActionsService,
} from '../shared/contracts/forkActions.service.ts';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { ChainName } from '../shared/contracts/constants.ts';
import { forkPort } from '../shared/config/forkPorts.ts';

// Same env as the tests use, so RPC URLs and the wallet come from .env.local.
nextEnv.loadEnvConfig(process.cwd());

const CHAINS: ChainName[] = ['hoodi', 'mainnet'];
const MODULES = Object.values(MODULE_NAME);
const normalize = (value: string) => value.toUpperCase().replaceAll('_', '');

const HELP: Record<
  (typeof COMMANDS)[number],
  { args: string; example: string }
> = {
  snapshot: {
    args: '',
    example: 'yarn fork csm hoodi snapshot',
  },
  revert: {
    args: '[snapshotId]',
    example: 'yarn fork csm hoodi revert 0x2',
  },
  addBond: {
    args: '<noId> <amountEth>',
    example: 'yarn fork csm hoodi addBond 12 3',
  },
  addKeys: {
    args: '<noId> <keysCount>',
    example: 'yarn fork csm hoodi addKeys 12 5',
  },
  depositKeys: {
    args: '<depositsCount>',
    example: 'yarn fork csm hoodi depositKeys 10',
  },
  proposeManager: {
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi proposeManager 12 0x1111111111111111111111111111111111111111',
  },
  confirmManager: {
    args: '<noId>',
    example: 'yarn fork csm hoodi confirmManager 12',
  },
  proposeReward: {
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi proposeReward 12 0x1111111111111111111111111111111111111111',
  },
  reportPenalty: {
    args: '<noId> <amountEth>',
    example: 'yarn fork csm hoodi reportPenalty 12 1',
  },
  settlePenalty: {
    args: '<noId>',
    example: 'yarn fork csm hoodi settlePenalty 12',
  },
  reportRewards: {
    args: '',
    example: 'yarn fork csm hoodi reportRewards',
  },
  setGateAddrs: {
    args: '<selector|[selectors]> <address...>',
    example:
      'yarn fork csm hoodi setGateAddrs ics 0x1111111111111111111111111111111111111111',
  },
  setShareLimit: {
    args: '<REACHED|EXHAUSTED|APPROACHING>',
    example: 'yarn fork csm hoodi setShareLimit REACHED',
  },
  createCuratedOperator: {
    args: '<selector> <address>',
    example:
      'yarn fork cm hoodi createCuratedOperator po 0x1111111111111111111111111111111111111111',
  },
  createOperatorGroup: {
    args: '<[{ id, weight }]>',
    example: `yarn fork cm hoodi createOperatorGroup '[{"id":12,"weight":50},{"id":1,"weight":50}]'`,
  },
};

const commandHelp = COMMANDS.map((name) => {
  const { args, example } = HELP[name];
  const signature = `${name} ${args}`.trimEnd();
  return `  ${signature}\n    ${example}`;
}).join('\n');

const USAGE = `Usage: yarn fork <module> <chain> <command> [args...]

  module   ${MODULES.join(' | ')}
  chain    ${CHAINS.join(' | ')}

  --host   fork node host (default: 127.0.0.1)
  --port   fork node port (default: the port of this module x chain)
  --rpc    full node URL, overrides --host and --port

Arguments starting with [ or { are parsed as JSON, the rest stay strings.

Commands:

${commandHelp}
`;

const fail = (message: string): never => {
  console.error(`${message}\n\n${USAGE}`);
  process.exit(1);
};

const parsed = (() => {
  try {
    return parseArgs({
      options: {
        host: { type: 'string' },
        port: { type: 'string' },
        rpc: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });
  } catch (error) {
    return fail((error as Error).message);
  }
})();

const { values, positionals } = parsed;

if (values.help) {
  console.info(USAGE);
  process.exit(0);
}

const [module, chain, command, ...rest] = positionals;

if (module === 'help') {
  console.info(USAGE);
  process.exit(0);
}

if (!module || !chain || !command) fail('Missing module, chain or command');
const sdkModule =
  MODULES.find((name) => normalize(name) === normalize(module ?? '')) ??
  fail(`Unknown module: ${module}`);
if (!CHAINS.includes(chain as ChainName)) fail(`Unknown chain: ${chain}`);
if (!COMMANDS.includes(command as (typeof COMMANDS)[number])) {
  fail(`Unknown command: ${command}`);
}

const args = rest.map((arg) =>
  /^[[{]/.test(arg) ? (JSON.parse(arg) as unknown) : arg,
);

const rpcUrl =
  values.rpc ??
  `http://${values.host ?? '127.0.0.1'}:${values.port ?? forkPort(chain as ChainName, sdkModule)}`;

const service = new ForkActionsService({
  rpcUrl,
  chain: chain as ChainName,
  module: sdkModule,
  step: async (title, body) => {
    console.info(title);
    return body();
  },
});

// Each module x chain has its own fork, so the usual mistake is talking to a
// port nothing is listening on.
try {
  await service.client.getChainId();
} catch {
  const profile = `${chain}-${module.toLowerCase()}`;
  console.error(
    `No fork answering at ${rpcUrl}\n` +
      `Start it: docker compose --env-file fork.env --profile ${profile} up -d --wait`,
  );
  process.exit(1);
}

const run = service[command as (typeof COMMANDS)[number]] as (
  ...params: unknown[]
) => Promise<unknown>;

try {
  const result = await run(...args);
  if (result !== undefined) console.info(result);
} catch (error) {
  console.error(`\n${(error as Error).message.split('\n')[0]}`);
  process.exit(1);
}
