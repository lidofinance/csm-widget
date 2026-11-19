import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import {
  COMMON_ADDRESSES,
  CONTRACT_NAMES,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { widgetFullConfig } from 'tests/cm-widget/config';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

const { chainId } = widgetFullConfig.standConfig.networkConfig;
const UNSUPPORTED_CHAIN_ID = 1337;
const RPC_URL = `/api/rpc?chainId=${chainId}`;

const FOREIGN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
const LOGS_ADDRESS =
  COMMON_ADDRESSES[chainId as SUPPORTED_CHAINS][CONTRACT_NAMES.stETH];
const MAX_GET_LOGS_RANGE = 1_000_000;
const MAX_BATCH = 20;
const ZERO_HASH = `0x${'0'.repeat(64)}`;
const SYMBOL_SELECTOR = '0x95d89b41';

const rpcCall = (method: unknown, params: unknown[] = [], id = 1) => ({
  jsonrpc: '2.0',
  id,
  method,
  params,
});

const ALLOWED_CALLS: {
  qaseId: number;
  method: string;
  params: unknown[];
  result?: string;
}[] = [
  {
    qaseId: 519,
    method: 'eth_chainId',
    params: [],
    result: `0x${chainId.toString(16)}`,
  },
  { qaseId: 520, method: 'net_version', params: [], result: `${chainId}` },
  { qaseId: 521, method: 'eth_blockNumber', params: [] },
  { qaseId: 522, method: 'eth_gasPrice', params: [] },
  { qaseId: 523, method: 'eth_maxPriorityFeePerGas', params: [] },
  { qaseId: 524, method: 'eth_feeHistory', params: ['0x1', 'latest', []] },
  { qaseId: 525, method: 'eth_getBlockByNumber', params: ['latest', false] },
  {
    qaseId: 526,
    method: 'eth_getBalance',
    params: [FOREIGN_ADDRESS, 'latest'],
  },
  {
    qaseId: 527,
    method: 'eth_getTransactionCount',
    params: [FOREIGN_ADDRESS, 'latest'],
  },
  { qaseId: 528, method: 'eth_getCode', params: [LOGS_ADDRESS, 'latest'] },
  {
    qaseId: 529,
    method: 'eth_estimateGas',
    params: [{ from: FOREIGN_ADDRESS, to: FOREIGN_ADDRESS, value: '0x0' }],
  },
  { qaseId: 530, method: 'eth_getTransactionByHash', params: [ZERO_HASH] },
  { qaseId: 531, method: 'eth_getTransactionReceipt', params: [ZERO_HASH] },
  {
    qaseId: 532,
    method: 'eth_call',
    params: [{ to: LOGS_ADDRESS, data: SYMBOL_SELECTOR }, 'latest'],
  },
  {
    qaseId: 533,
    method: 'eth_getLogs',
    params: [{ address: LOGS_ADDRESS, fromBlock: 'latest', toBlock: 'latest' }],
  },
];

test.describe(
  ...suite({
    epic: EPIC.security,
    story: 'BFF RPC proxy',
    tag: Tags.webSecurity,
  }),
  () => {
    ALLOWED_CALLS.forEach(({ qaseId, method, params, result }) => {
      test(qase(qaseId, `Should proxy ${method}`), async ({ request }) => {
        const resp = await test.step('Proxy passes the call', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall(method, params),
          });
          expect(resp.status()).toBe(200);
          return resp;
        });

        await test.step('Node returns a result, not an error', async () => {
          const body = await resp.json();
          expect(body.error).toBeUndefined();
          expect(body).toHaveProperty('result');
          if (result) expect(body.result).toBe(result);
        });
      });
    });

    test(
      qase(534, 'Should proxy eth_sendRawTransaction'),
      async ({ request }) => {
        const resp = await test.step('Proxy passes the call', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_sendRawTransaction', ['0x00']),
          });
          expect(resp.status()).toBe(200);
          return resp;
        });

        await test.step('Node rejects the malformed tx', async () => {
          expect((await resp.json()).error).toHaveProperty('code');
        });
      },
    );

    test(
      qase(535, 'Should reject disallowed HTTP method and chain'),
      async ({ request }) => {
        await test.step('GET is refused with Allow: POST', async () => {
          const resp = await request.get(RPC_URL);
          expect(resp.status()).toBe(405);
          expect(resp.headers()['allow']).toBe('POST');
        });

        await test.step('Unsupported chainId is refused', async () => {
          const resp = await request.post(
            `/api/rpc?chainId=${UNSUPPORTED_CHAIN_ID}`,
            { data: rpcCall('eth_chainId') },
          );
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe('Unsupported chainId');
        });
      },
    );

    test(
      qase(536, 'Should reject RPC methods outside allowlist'),
      async ({ request }) => {
        for (const method of [
          'eth_accounts',
          'eth_sendTransaction',
          'eth_sign',
          'eth_getStorageAt',
          'personal_unlockAccount',
          'debug_traceTransaction',
          'admin_peers',
          'txpool_content',
        ]) {
          await test.step(`${method} is refused`, async () => {
            const resp = await request.post(RPC_URL, { data: rpcCall(method) });
            expect(resp.status()).toBe(400);
            expect(await resp.json()).toBe(`RPC method ${method} not allowed`);
          });
        }

        await test.step('Non-string method is refused', async () => {
          const resp = await request.post(RPC_URL, { data: rpcCall(1) });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe("RPC method isn't string");
        });
      },
    );

    test(
      qase(537, 'Should reject eth_call outside address allowlist'),
      async ({ request }) => {
        await test.step('Foreign contract is refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_call', [
              { to: FOREIGN_ADDRESS, data: '0x' },
              'latest',
            ]),
          });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe(
            `Address ${FOREIGN_ADDRESS} is not allowed for eth_call`,
          );
        });

        await test.step('Call without "to" and "data" is refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_call', [{}, 'latest']),
          });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe('RPC method eth_call is invalid');
        });
      },
    );

    test(
      qase(538, 'Should reject eth_getLogs outside address and range limits'),
      async ({ request }) => {
        await test.step('Logs without address are refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_getLogs', [
              { fromBlock: '0x1', toBlock: '0x2' },
            ]),
          });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe(
            'RPC method eth_getLogs address is invalid',
          );
        });

        await test.step('Logs of foreign contract are refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_getLogs', [
              { address: FOREIGN_ADDRESS, fromBlock: '0x1', toBlock: '0x2' },
            ]),
          });
          expect(resp.status()).toBe(400);
        });

        await test.step('Range over the limit is refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_getLogs', [
              {
                address: LOGS_ADDRESS,
                fromBlock: '0x0',
                toBlock: `0x${(MAX_GET_LOGS_RANGE + 1).toString(16)}`,
              },
            ]),
          });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe(
            'RPC method eth_getLogs range is invalid',
          );
        });

        await test.step('"earliest" fromBlock is refused', async () => {
          const resp = await request.post(RPC_URL, {
            data: rpcCall('eth_getLogs', [
              { address: LOGS_ADDRESS, fromBlock: 'earliest', toBlock: '0x1' },
            ]),
          });
          expect(resp.status()).toBe(400);
          expect(await resp.json()).toBe(
            'RPC method eth_getLogs fromBlock is invalid',
          );
        });
      },
    );

    test(qase(539, 'Should cap batch size'), async ({ request }) => {
      const batch = (size: number) =>
        Array.from({ length: size }, (_, i) => rpcCall('eth_chainId', [], i));

      await test.step(`Batch of ${MAX_BATCH} passes`, async () => {
        const resp = await request.post(RPC_URL, { data: batch(MAX_BATCH) });
        expect(resp.status()).toBe(200);
      });

      await test.step(`Batch of ${MAX_BATCH + 1} is refused`, async () => {
        const resp = await request.post(RPC_URL, {
          data: batch(MAX_BATCH + 1),
        });
        expect(resp.status()).toBe(400);
        expect(await resp.json()).toBe('Too many batched requests');
      });

      await test.step('One disallowed call fails the whole batch', async () => {
        const resp = await request.post(RPC_URL, {
          data: [
            rpcCall('eth_chainId', [], 1),
            rpcCall('debug_traceTransaction', [], 2),
          ],
        });
        expect(resp.status()).toBe(400);
        expect(await resp.json()).toBe(
          'RPC method debug_traceTransaction not allowed',
        );
      });
    });
  },
);
