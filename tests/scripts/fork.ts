import { parseArgs, styleText } from 'node:util';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
import {
  COMMANDS,
  ForkActionsService,
} from '../shared/contracts/forkActions.service.ts';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { ChainName } from '../shared/contracts/constants.ts';
import { forkPort } from '../shared/config/forkPorts.ts';
import { ROLES } from '../shared/contracts/commands/grantRole.ts';

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
  fundTokens: {
    args: '<address> <amountEth>',
    example: 'yarn fork csm hoodi fundTokens 0xAbC... 10',
  },
  grantRole: {
    args: '<role> <address>',
    example:
      'yarn fork csm hoodi grantRole REPORT_GENERAL_DELAYED_PENALTY_ROLE 0x1111111111111111111111111111111111111111',
  },
  removeKeys: {
    args: '<noId> [startIndex] [keysCount]',
    example: 'yarn fork csm hoodi removeKeys 12',
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
  setRewardsClaimer: {
    args: '<noId> <address>',
    example:
      'yarn fork csm hoodi setRewardsClaimer 12 0x1111111111111111111111111111111111111111',
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
  createPermissionlessOperator: {
    args: '<address> [keysCount]',
    example:
      'yarn fork csm hoodi createPermissionlessOperator 0x1111111111111111111111111111111111111111 3',
  },
  keyTopup: {
    args: '<noId> <keyIndex> <amountEth>',
    example: 'yarn fork csm hoodi keyTopup 12 0 1',
  },
  topup: {
    args: '<address> [amountEth]',
    example: 'yarn fork csm hoodi topup 0xAbC... 100',
  },
  createOperatorGroup: {
    args: '<[{ id, weight }]>',
    example: `yarn fork cm hoodi createOperatorGroup '[{"id":12,"weight":50},{"id":1,"weight":50}]'`,
  },
};

const heading = (text: string) => styleText(['bold', 'cyan'], text);
const dim = (text: string) => styleText('gray', text);

type Command = (typeof COMMANDS)[number];

const CATEGORIES: Record<string, Command[]> = {
  'Fork state': ['snapshot', 'revert'],
  'Wallet & access': ['topup', 'fundTokens', 'grantRole'],
  Operators: [
    'createPermissionlessOperator',
    'createCuratedOperator',
    'createOperatorGroup',
    'proposeManager',
    'confirmManager',
    'proposeReward',
    'setRewardsClaimer',
  ],
  Keys: ['addKeys', 'removeKeys', 'depositKeys', 'keyTopup'],
  'Bond & rewards': ['addBond', 'reportRewards'],
  Penalties: ['reportPenalty', 'settlePenalty'],
  Module: ['setGateAddrs', 'setShareLimit'],
};

const categorized = new Set(Object.values(CATEGORIES).flat());
const uncategorized = COMMANDS.filter((name) => !categorized.has(name));
if (uncategorized.length > 0) CATEGORIES.Other = uncategorized;

const nameWidth = Math.max(...COMMANDS.map((name) => name.length));
const formatCommand = (name: Command) => {
  const { args, example } = HELP[name];
  const title = styleText(['bold', 'green'], name.padEnd(nameWidth));
  const indent = ' '.repeat(nameWidth + 6);
  return [
    args ? `    ${title}  ${styleText('yellow', args)}` : `    ${title}`,
    indent + dim('$ ' + example),
  ].join('\n');
};
const commandHelp = Object.entries(CATEGORIES)
  .map(([category, names]) =>
    [
      `  ${styleText(['bold', 'magenta'], category)}`,
      ...names.map(formatCommand),
    ].join('\n'),
  )
  .join('\n');

const roleWidth = Math.max(...Object.keys(ROLES).map((role) => role.length));
const roleHelp = [
  ...new Set(Object.values(ROLES).map(([contract]) => contract)),
]
  .map((contract) => {
    const rows = Object.entries(ROLES)
      .filter(([, [owner]]) => owner === contract)
      .map(
        ([role, [, about]]) =>
          `    ${styleText('green', role.padEnd(roleWidth))}  ${about}`,
      );
    return [`  ${styleText(['bold', 'magenta'], contract)}`, ...rows].join(
      '\n',
    );
  })
  .join('\n');

const USAGE = `${heading('USAGE')}

  yarn fork ${styleText('yellow', '<module> <chain> <command> [args...]')}

  ${styleText('green', 'module')}   ${MODULES.join(' | ')}
  ${styleText('green', 'chain')}    ${CHAINS.join(' | ')}

  ${styleText('green', '--host')}   fork node host ${dim('(default: 127.0.0.1)')}
  ${styleText('green', '--port')}   fork node port ${dim('(default: the port of this chain)')}
  ${styleText('green', '--rpc')}    full node URL, overrides --host and --port

  ${dim('Arguments starting with [ or { are parsed as JSON, the rest stay strings.')}

${heading('COMMANDS')}

${commandHelp}

${heading('ROLES')} ${dim('for grantRole, grouped by contract')}

${roleHelp}
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
  `http://${values.host ?? '127.0.0.1'}:${values.port ?? forkPort(chain as ChainName)}`;

const service = new ForkActionsService({
  rpcUrl,
  chain: chain as ChainName,
  module: sdkModule,
  step: async (title, body) => {
    console.info(title);
    return body();
  },
});

// Each chain has its own fork, so the usual mistake is talking to a port
// nothing is listening on.
try {
  await service.client.getChainId();
} catch {
  console.error(
    `No fork answering at ${rpcUrl}\n` +
      `Start it: docker compose --env-file fork.env --profile ${chain} up -d --wait`,
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
