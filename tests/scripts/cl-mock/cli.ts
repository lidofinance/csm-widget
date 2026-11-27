import { createServer, type IncomingMessage } from 'node:http';
import { parseArgs } from 'node:util';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
import {
  buildClResponse,
  CL_STATUS,
  CL_VALIDATORS_PATH,
} from '../../shared/helpers/clMockResponse.ts';
import {
  clUpstream,
  isClStatus,
  readClStates,
  writeClStates,
} from './statuses.ts';

const HELP = `Local CL for manual checks of key statuses.

  yarn cl-mock start [--port 5052]
  yarn cl-mock set <STATUS> <pubkey...>
  yarn cl-mock remove <pubkey...>
  yarn cl-mock list
  yarn cl-mock reset

Statuses: ${Object.keys(CL_STATUS).join(', ')}

One server for both networks: point the widget at http://localhost:5052/hoodi
or /mainnet on /qa-config (CL API URL), then reload the page after every
change. Keys without a status are answered by the real CL of that network
(CL_API_URLS_<chainId> from .env.local). In docker: the cl-mock service.`;

nextEnv.loadEnvConfig(process.cwd());

const PUBKEY = /^0x[0-9a-f]{96}$/i;
const CHAIN_PATH = /^\/(hoodi|mainnet)\//;

const fail: (message: string) => never = (message) => {
  console.error(message);
  process.exit(1);
};

const checkPubkeys = (pubkeys: string[]) => {
  if (pubkeys.length === 0) fail('No pubkeys given');
  const bad = pubkeys.find((pubkey) => !PUBKEY.test(pubkey));
  if (bad) fail(`Not a pubkey: ${bad}`);
  return pubkeys.map((pubkey) => pubkey.toLowerCase());
};

const readBody = async (req: IncomingMessage) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body;
};

/** Pubkeys with a status get it, the rest the real CL's answer */
const answer = async (body: string, upstream: string | undefined) => {
  const { ids = [] } = JSON.parse(body);
  const real = upstream
    ? await fetch(`${upstream}${CL_VALIDATORS_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
        .then((response) => (response.ok ? response.json() : undefined))
        .catch(() => undefined)
    : undefined;
  const response = buildClResponse(readClStates(), ids, real);
  console.info(`[cl-mock] ${ids.length} key(s), ${response.data.length} found`);
  return response;
};

const start = (port: number) => {
  createServer(async (req, res) => {
    // the deployed widget calls it from its own origin; Chrome asks before a
    // public page may call localhost
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    if (req.method === 'OPTIONS') return res.writeHead(204).end();
    // the SDK posts `{ ids }` first and only falls back to GET when that fails
    const chain = req.url?.match(CHAIN_PATH)?.[1];
    if (
      req.method !== 'POST' ||
      !chain ||
      !req.url?.endsWith(CL_VALIDATORS_PATH)
    ) {
      return res.writeHead(404).end();
    }
    const response = await answer(await readBody(req), clUpstream(chain));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  }).listen(port, () => {
    for (const chain of ['hoodi', 'mainnet']) {
      console.info(
        `[cl-mock] ${chain} CL on http://localhost:${port}/${chain}, real CL ${clUpstream(chain) ? 'on' : 'off'}`,
      );
    }
  });
};

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    port: { type: 'string', default: '5052' },
  },
});
const [command, ...args] = positionals;

switch (command) {
  case 'start':
    start(Number(values.port));
    break;
  case 'set': {
    const [status, ...pubkeys] = args;
    if (!isClStatus(status)) fail(`Unknown status ${status}`);
    const states = readClStates();
    for (const pubkey of checkPubkeys(pubkeys)) states[pubkey] = status;
    writeClStates(states);
    console.info(`${pubkeys.length} key(s) → ${status}`);
    break;
  }
  case 'remove': {
    const states = readClStates();
    for (const pubkey of checkPubkeys(args)) delete states[pubkey];
    writeClStates(states);
    break;
  }
  case 'list': {
    const entries = Object.entries(readClStates());
    if (entries.length === 0) console.info('No keys');
    for (const [pubkey, status] of entries) console.info(status, pubkey);
    break;
  }
  case 'reset': {
    writeClStates({});
    break;
  }
  default:
    console.info(HELP);
}
