import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { KeysGeneratorService } from '../shared/services/keysGenerator.service.ts';

/** Lido Withdrawal Vault per chain — the addresses the e2e configs use. */
const WITHDRAWAL_VAULT: Record<string, string> = {
  hoodi: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
  mainnet: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
};

const WC_TYPES = ['0x01', '0x02'];

const USAGE = `Usage: yarn keys:generate [options]

  -c, --chain  hoodi | mainnet                      (default: hoodi)
  -n, --count  number of keys                       (default: 1)
  -t, --type   0x01 regular | 0x02 compounding      (default: 0x01)
  -o, --out    output file                          (default: deposit_data.json)
`;

const fail = (message: string): never => {
  console.error(`${message}\n\n${USAGE}`);
  process.exit(1);
};

const { values } = parseArgs({
  options: {
    chain: { type: 'string', short: 'c' },
    count: { type: 'string', short: 'n' },
    type: { type: 'string', short: 't' },
    out: { type: 'string', short: 'o' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (values.help) {
  console.info(USAGE);
  process.exit(0);
}

const chain = values.chain ?? 'hoodi';
const wcType = values.type ?? '0x01';
const count = Number(values.count ?? 1);
const out = values.out ?? 'deposit_data.json';

const withdrawalCredentials =
  WITHDRAWAL_VAULT[chain] ?? fail(`Unknown chain: ${chain}`);
if (!WC_TYPES.includes(wcType)) fail(`Unknown credentials type: ${wcType}`);
if (!Number.isInteger(count) || count < 1)
  fail(`Count must be a positive integer: ${values.count}`);

const keys = new KeysGeneratorService({
  chain,
  withdrawalCredentials,
  isCM: wcType === '0x02',
}).generateKeys(count);

const json = JSON.stringify(keys, null, 2);

writeFileSync(out, `${json}\n`);
console.info(json);
console.info(`Generated ${count} key(s) for ${chain} (${wcType}) → ${out}`);
