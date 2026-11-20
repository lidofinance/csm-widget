import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { parseArgs } from 'node:util';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import {
  LidoSDKCm,
  LidoSDKCsm,
  LidoSDKCsm02,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { isAddress, isAddressEqual, type Address } from 'viem';
import { CL_STATUS } from '../../shared/helpers/clMockResponse.ts';
import {
  COMMANDS,
  ForkActionsService,
} from '../../shared/contracts/forkActions.service.ts';
import {
  CATEGORIES,
  HELP,
  NEEDS,
} from '../../shared/contracts/commandsHelp.ts';
import { ROLES } from '../../shared/contracts/commands/grantRole.ts';
import { CHAIN_ID, type ChainName } from '../../shared/contracts/constants.ts';
import { warmUpAddress } from '../../shared/helpers/warmUpFork.ts';
import { forkPort } from '../../shared/config/forkPorts.ts';
import {
  readPreset,
  readPresetsFile,
  stateFile,
} from '../../shared/config/walletSetup/presetsState.ts';
import {
  clUpstream,
  isClStatus,
  readClStates,
  writeClStates,
} from '../cl-mock/statuses.ts';
import {
  composeArgs,
  DOCKER_ACTIONS,
  type DockerAction,
  type Profile,
  PROFILES,
  TUNNEL_PATHS,
  readDocker,
  runDocker,
} from './docker.ts';

// Local QA panel: docker, warm-up, presets, fork actions, operator keys and
// the statuses of the CL mock in one page. The mock itself is the cl-mock
// container (or `yarn cl-mock start`): both read cl-mock.json.
//
//   yarn qa-panel                  # hoodi, http://localhost:5050
//   yarn qa-panel mainnet --port 5051
//   docker compose --env-file fork.env --profile qa up -d   # the same, in docker

nextEnv.loadEnvConfig(process.cwd());

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    port: { type: 'string', default: '5050' },
    // inside docker the fork is reached by its service name, not the host port
    rpc: { type: 'string' },
  },
});
const chain = (positionals[0] ?? 'hoodi') as ChainName;
if (!['hoodi', 'mainnet'].includes(chain)) {
  console.error(`Unknown chain ${chain}: use hoodi or mainnet`);
  process.exit(1);
}
const port = Number(values.port);
const rpcUrl = values.rpc ?? `http://127.0.0.1:${forkPort(chain)}`;
const page = readFileSync(new URL('index.html', import.meta.url));

/* ---------- jobs: fork commands, docker and warm-up share one log ---------- */

type LogLine = { depth: number; text: string };
let runLog: LogLine[] = [];
let depth = 0;
const log = (text: string, extra = 0) =>
  runLog.push({ depth: depth + extra, text });

type Run = {
  line: string;
  ok: boolean;
  result?: unknown;
  error?: string;
  log: LogLine[];
  ms: number;
  at: number;
};
const history: Run[] = [];
let current: Run | null = null;

// One job at a time: parallel transactions from one sender fight over nonces
let queue: Promise<unknown> = Promise.resolve();
const runJob = (line: string, task: () => Promise<unknown>) => {
  const job = queue.then(async () => {
    runLog = [];
    depth = 0;
    const run: Run = { line, ok: true, log: runLog, ms: 0, at: Date.now() };
    current = run;
    try {
      run.result = await task();
    } catch (error) {
      run.ok = false;
      run.error = (error as Error).message.split('\n')[0];
    }
    run.ms = Date.now() - run.at;
    current = null;
    history.unshift(run);
    history.length = Math.min(history.length, 50);
    return run;
  });
  queue = job.catch(() => undefined);
  return job;
};

/* ---------- fork ---------- */

const services = new Map<MODULE_NAME, ForkActionsService | null>();
const service = (module: MODULE_NAME) => {
  if (!services.has(module)) {
    try {
      services.set(
        module,
        new ForkActionsService({
          rpcUrl,
          chain,
          module,
          step: async (title, body) => {
            log(title);
            depth++;
            try {
              return await body();
            } finally {
              depth--;
            }
          },
        }),
      );
    } catch {
      // the module is not deployed on this chain
      services.set(module, null);
    }
  }
  return services.get(module) ?? null;
};
const SDKS = {
  [MODULE_NAME.CSM]: LidoSDKCsm,
  [MODULE_NAME.CSM_02]: LidoSDKCsm02,
  [MODULE_NAME.CM]: LidoSDKCm,
};
const MODULES = Object.values(MODULE_NAME).filter((module) => service(module));

const actionsOf = (module: MODULE_NAME) => {
  const actions = service(module);
  if (!actions) throw new Error(`${module} is not deployed on ${chain}`);
  return actions;
};

const runCommand = (module: MODULE_NAME, command: string, args: string[]) => {
  if (!COMMANDS.includes(command as never)) {
    throw new Error(`Unknown command ${command}`);
  }
  const fn = actionsOf(module)[command as (typeof COMMANDS)[number]] as (
    ...params: unknown[]
  ) => Promise<unknown>;
  return runJob(
    `yarn fork ${module.toLowerCase()} ${chain} ${command} ${args.join(' ')}`,
    // same rule as `yarn fork`: JSON-looking arguments are parsed
    () => fn(...args.map((arg) => (/^[[{]/.test(arg) ? JSON.parse(arg) : arg))),
  );
};

const KEYS_PER_READ = 100n;

/** The operator's struct, or null when there is no such operator */
const readNodeOperator = async (module: MODULE_NAME, id: bigint) => {
  const { client, addresses } = actionsOf(module);
  const contract = { address: addresses.module, abi: BaseModuleAbi } as const;
  const count = await client.readContract({
    ...contract,
    functionName: 'getNodeOperatorsCount',
  });
  if (id >= count) return { count, info: null, client, contract };
  const info = await client.readContract({
    ...contract,
    functionName: 'getNodeOperator',
    args: [id],
  });
  return { count, info, client, contract };
};

const readOperator = async (module: MODULE_NAME, id: bigint) => {
  const { count, info, client, contract } = await readNodeOperator(module, id);
  if (!info) {
    throw new Error(`No operator #${id} in ${module}: there are ${count}`);
  }
  const added = BigInt(info.totalAddedKeys);

  const pubkeys: string[] = [];
  for (let start = 0n; start < added; start += KEYS_PER_READ) {
    const length =
      added - start < KEYS_PER_READ ? added - start : KEYS_PER_READ;
    const bytes = await client.readContract({
      ...contract,
      functionName: 'getSigningKeys',
      args: [id, start, length],
    });
    pubkeys.push(
      ...(bytes.slice(2).match(/.{96}/g) ?? []).map((k) => `0x${k}`),
    );
  }

  const states = readClStates();
  return {
    id: Number(id),
    module,
    operatorsCount: Number(count),
    info: {
      added: info.totalAddedKeys,
      vetted: info.totalVettedKeys,
      deposited: info.totalDepositedKeys,
      depositable: info.depositableValidatorsCount,
      exited: info.totalExitedKeys,
      withdrawn: info.totalWithdrawnKeys,
      manager: info.managerAddress,
      reward: info.rewardAddress,
    },
    keys: pubkeys.map((pubkey, index) => ({
      index,
      pubkey,
      vetted: index < info.totalVettedKeys,
      deposited: index < info.totalDepositedKeys,
      cl: states[pubkey] ?? null,
    })),
  };
};

const ownsOperator = async (
  module: MODULE_NAME,
  noId: number,
  address: string,
) => {
  const { info } = await readNodeOperator(module, BigInt(noId));
  return (
    !!info &&
    [info.managerAddress, info.rewardAddress].some((role) =>
      isAddressEqual(role, address as Address),
    )
  );
};

/* ---------- presets: the e2e wallets, stale once the fork restarts ---------- */

// Without the mnemonics: the page asks for one by /api/presets/secret
const readPresets = async () => {
  const file = stateFile(chain);
  if (!existsSync(file)) return { file, exists: false, presets: [] };
  const presets = await Promise.all(
    Object.entries(readPresetsFile(chain)).flatMap(([module, entries]) =>
      Object.entries(entries ?? {}).map(
        async ([name, { secretPhrase: _, ...preset }]) => ({
          module,
          name,
          ...preset,
          // does its operator exist on the fork and belong to it?
          onFork:
            preset.noId === undefined
              ? null
              : await ownsOperator(
                  module as MODULE_NAME,
                  preset.noId,
                  preset.address,
                ).catch(() => false),
        }),
      ),
    ),
  );
  return { file, exists: true, presets };
};

/* ---------- warm-up: done since the fork started? ---------- */

const STATE_FILE = '.qa-panel.state.json';
type WarmUp = { at: number; address: string; module: string; ms: number };
const readWarmUps = (): Record<string, WarmUp> =>
  existsSync(STATE_FILE)
    ? (JSON.parse(readFileSync(STATE_FILE, 'utf8')).warmUps ?? {})
    : {};
const saveWarmUp = (warm: WarmUp) =>
  writeFileSync(
    STATE_FILE,
    `${JSON.stringify({ warmUps: { ...readWarmUps(), [chain]: warm } }, null, 2)}\n`,
  );

/* ---------- state ---------- */

const readState = async () => {
  const [block, docker] = await Promise.all([
    service(MODULES[0])
      ?.client.getBlockNumber()
      .catch(() => null),
    readDocker(),
  ]);
  const profile = (name: Profile) =>
    docker.profiles.find((p) => p.profile === name);
  const forkStartedAt = profile(chain)?.node?.startedAt;
  const warm = readWarmUps()[chain] ?? null;

  return {
    chain,
    rpcUrl,
    block,
    forkAlive: block != null,
    docker,
    // the deployed widget can't call localhost: /qa-config takes the tunnel
    tunnelUrl: docker.tunnelUrl,
    rpcTunnel: docker.tunnelUrl && `${docker.tunnelUrl}${TUNNEL_PATHS[chain]}`,
    ipfsTunnel: docker.tunnelUrl && `${docker.tunnelUrl}${TUNNEL_PATHS.ipfs}`,
    clUrl: docker.tunnelUrl
      ? `${docker.tunnelUrl}${TUNNEL_PATHS.cl}`
      : `http://localhost:${process.env.CL_PORT ?? 5052}`,
    clUpstream: !!clUpstream(chain),
    clMocked: Object.keys(readClStates()).length,
    forkStartedAt: forkStartedAt ?? null,
    warm: warm && {
      ...warm,
      current: !!forkStartedAt && warm.at > new Date(forkStartedAt).getTime(),
    },
    running: current,
  };
};

const meta = {
  chain,
  modules: MODULES,
  profiles: PROFILES,
  tunnelPaths: TUNNEL_PATHS,
  statuses: Object.keys(CL_STATUS),
  // fixed value sets of command arguments, shown as dropdowns
  gates: Object.fromEntries(
    MODULES.map((module) => [
      module,
      Object.keys(actionsOf(module).addresses.gates),
    ]),
  ),
  roles: Object.entries(ROLES).map(([name, [contract, about]]) => ({
    name,
    contract,
    about,
  })),
  categories: Object.entries(CATEGORIES).map(([name, commands]) => ({
    name,
    commands: commands.map((command) => {
      const { needs } = HELP[command];
      return {
        command,
        ...HELP[command],
        // modules deployed on this chain with the contracts the command needs
        modules: MODULES.filter(
          (module) => !needs || NEEDS[needs](actionsOf(module).addresses),
        ),
      };
    }),
  })),
};

/* ---------- http ---------- */

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify(body, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
};

const toModule = (value: unknown) => {
  const found = MODULES.find((name) => name === value);
  if (!found) throw new Error(`Unknown module ${value}`);
  return found;
};

// The API reveals preset mnemonics and drives the fork: only this page may
// call it. No CORS headers on /api, so other origins can't read the answers;
// JSON bodies force a preflight they never pass. The Host check stops DNS
// rebinding, where a foreign page reaches the panel as its own origin
const LOCAL = /^(localhost|127\.0\.0\.1)(:\d+)?$/;
const isOwnRequest = (req: IncomingMessage) => {
  const { host, origin } = req.headers;
  if (!host || !LOCAL.test(host)) return false;
  if (origin && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return false;
  }
  const site = req.headers['sec-fetch-site'];
  if (site && site !== 'same-origin' && site !== 'none') return false;
  return (
    req.method === 'GET' ||
    !!req.headers['content-type']?.startsWith('application/json')
  );
};

const body = async (req: IncomingMessage) => {
  let text = '';
  for await (const chunk of req) text += chunk;
  return JSON.parse(text);
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname.startsWith('/api') && !isOwnRequest(req)) {
    return json(res, 403, { error: 'Only the panel page may call the API' });
  }

  try {
    switch (`${req.method} ${url.pathname}`) {
      case 'GET /':
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          // the page and the API change together: never run an old page
          'Cache-Control': 'no-store',
        });
        return res.end(page);
      case 'GET /api/meta':
        return json(res, 200, meta);
      case 'GET /api/state':
        return json(res, 200, await readState());
      case 'GET /api/history':
        return json(res, 200, history);
      case 'GET /api/operator':
        return json(
          res,
          200,
          await readOperator(
            toModule(url.searchParams.get('module')),
            BigInt(url.searchParams.get('id') ?? ''),
          ),
        );
      case 'GET /api/presets':
        return json(res, 200, await readPresets());
      case 'POST /api/presets/secret': {
        const { module: name, preset } = await body(req);
        return json(res, 200, {
          secretPhrase: readPreset(chain, toModule(name), String(preset))
            .secretPhrase,
        });
      }
      case 'POST /api/presets/delete':
        rmSync(stateFile(chain), { force: true });
        return json(res, 200, {});
      case 'POST /api/run': {
        const { module: name, command, args = [] } = await body(req);
        return json(res, 200, await runCommand(toModule(name), command, args));
      }
      case 'POST /api/docker': {
        const { profile, action } = await body(req);
        if (!PROFILES.includes(profile) || !(action in DOCKER_ACTIONS)) {
          throw new Error(`Unknown docker action ${action} ${profile}`);
        }
        const args = composeArgs(profile, action as DockerAction);
        return json(
          res,
          200,
          await runJob(`docker ${args.join(' ')}`, () =>
            runDocker(args, (line) => log(line, 1)),
          ),
        );
      }
      case 'POST /api/warmup': {
        const { module: name, address } = await body(req);
        if (!isAddress(address)) throw new Error(`Not an address: ${address}`);
        const warmModule = toModule(name);
        return json(
          res,
          200,
          await runJob(
            `warm up ${chain} ${warmModule} ${address}`,
            async () => {
              const started = Date.now();
              // the same calls as the e2e globalSetup, so the widget's first
              // load hits a warm cache
              const sdk = new SDKS[warmModule]({
                core: new LidoSDKCore({
                  chainId: CHAIN_ID[chain],
                  rpcUrls: [rpcUrl],
                }),
              });
              const operators = await warmUpAddress(sdk, address, (line) =>
                log(line, 1),
              );
              saveWarmUp({
                at: Date.now(),
                address,
                module: warmModule,
                ms: Date.now() - started,
              });
              return { operators };
            },
          ),
        );
      }
      case 'POST /api/cl': {
        const { pubkeys = [], status } = await body(req);
        if (status !== null && !isClStatus(status)) {
          throw new Error(`Unknown status ${status}`);
        }
        const states = readClStates();
        for (const pubkey of pubkeys as string[]) {
          if (status === null) delete states[pubkey.toLowerCase()];
          else states[pubkey.toLowerCase()] = status;
        }
        writeClStates(states);
        return json(res, 200, states);
      }
      case 'POST /api/cl/reset':
        writeClStates({});
        return json(res, 200, {});
      default:
        return json(res, 404, { error: 'Not found' });
    }
  } catch (error) {
    return json(res, 400, { error: (error as Error).message.split('\n')[0] });
  }
}).listen(port, () => {
  console.info(`[qa-panel] ${chain} on http://localhost:${port}`);
  console.info(`[qa-panel] fork ${rpcUrl}, modules ${MODULES.join(', ')}`);
});
