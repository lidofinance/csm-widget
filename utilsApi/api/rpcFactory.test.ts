import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import type { NextApiRequest, NextApiResponse } from 'next';

import { DEFAULT_API_ERROR_MESSAGE } from '@lidofinance/next-api-wrapper';
import { rpcFactory } from './rpcFactory';
import type { RPCFactoryParams } from './types';

type FetchRPC = RPCFactoryParams['fetchRPC'];

const providers: RPCFactoryParams['providers'] = {
  '1': ['https://first.example/key-1', 'https://second.example/key-2'],
};

const body = { jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] };

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(
    servers
      .splice(0)
      .map((server) => new Promise((resolve) => server.close(resolve))),
  );
});

const buildApp = async (fetchRPC: FetchRPC) => {
  const handler = rpcFactory({
    providers,
    fetchRPC,
    defaultChain: 1,
    validation: {
      allowedRPCMethods: ['eth_chainId'],
      allowedCallAddresses: {},
      allowedLogsAddresses: {},
      maxResponseSize: 100,
    },
    serverLogger: {
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as RPCFactoryParams['serverLogger'],
  });

  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const nextReq = Object.assign(req, {
        query: {},
        body: JSON.parse(Buffer.concat(chunks).toString() || 'null'),
      }) as unknown as NextApiRequest;
      const nextRes = Object.assign(res, {
        status(code: number) {
          res.statusCode = code;
          return nextRes;
        },
        json(payload: unknown) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        },
      }) as unknown as NextApiResponse;
      void handler(nextReq, nextRes);
    });
  });
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return () =>
    fetch(`http://127.0.0.1:${port}/rpc`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
};

describe('rpcFactory', () => {
  test('streams ok upstream response', async () => {
    const fetchRPC = vi
      .fn<FetchRPC>()
      .mockResolvedValue(new Response('{"result":"0x1"}', { status: 200 }));
    const res = await (await buildApp(fetchRPC))();

    expect(res.status).toBe(200);
    expect(await res.text()).toBe('{"result":"0x1"}');
  });

  test('502 when every provider answers non-ok', async () => {
    const fetchRPC = vi
      .fn<FetchRPC>()
      .mockImplementation(() =>
        Promise.resolve(new Response('provider says: nope', { status: 503 })),
      );
    const res = await (await buildApp(fetchRPC))();

    expect(res.status).toBe(502);
    expect(await res.json()).toBe(DEFAULT_API_ERROR_MESSAGE);
  });

  test('413 on oversized Content-Length', async () => {
    const fetchRPC = vi.fn<FetchRPC>().mockResolvedValue(
      new Response('x'.repeat(500), {
        status: 200,
        headers: { 'Content-Length': '500' },
      }),
    );
    const res = await (await buildApp(fetchRPC))();

    expect(res.status).toBe(413);
  });

  test('500 body is the constant message', async () => {
    const fetchRPC = vi
      .fn<FetchRPC>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    const res = await (await buildApp(fetchRPC))();

    expect(res.status).toBe(500);
    expect(await res.json()).toBe(DEFAULT_API_ERROR_MESSAGE);
  });
});
