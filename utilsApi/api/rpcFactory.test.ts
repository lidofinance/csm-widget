import { PassThrough } from 'node:stream';

import { DEFAULT_API_ERROR_MESSAGE } from '@lidofinance/next-api-wrapper';

import { rpcFactory } from './rpcFactory';

const ALLOWED = '0x' + 'ab'.repeat(20);
const SLOT = '0x' + '01'.repeat(32);

const setup = (validation: Record<string, unknown> = {}) => {
  const fetchRPC = vi.fn((_url: string, _init: any, _ctx: any) =>
    Promise.resolve(
      new Response('[]', { headers: { 'Content-Type': 'application/json' } }),
    ),
  );
  const handler = rpcFactory({
    fetchRPC: fetchRPC as any,
    providers: { 1: ['http://rpc'] },
    defaultChain: 1,
    validation: {
      allowedRPCMethods: ['eth_chainId', 'eth_call'],
      ...validation,
    },
  } as any);

  const run = async (body: unknown) => {
    const res: any = new PassThrough();
    res.setHeader = vi.fn();
    res.status = vi.fn(() => res);
    res.json = vi.fn();
    res.headersSent = false;
    res.resume();
    await handler(
      { method: 'POST', query: { chainId: '1' }, body } as any,
      res,
    );
    return res;
  };
  const sent = () => fetchRPC.mock.calls[0]?.[1].body;
  return { run, fetchRPC, sent };
};

describe('rpcFactory canonical forwarding', () => {
  it('forwards only canonical envelope keys', async () => {
    const { run, sent } = setup();
    await run({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_chainId',
      Method: 'debug_traceCall',
      extra: 1,
    });
    expect(Object.keys(sent())).toEqual(['jsonrpc', 'id', 'method']);
  });

  it('keeps batch order, ids and array shape', async () => {
    const { run, sent } = setup();
    await run([3, 1, 2].map((id) => ({ id, method: 'eth_chainId' })));
    expect(Array.isArray(sent())).toBe(true);
    expect(sent().map((r: any) => r.id)).toEqual([3, 1, 2]);
  });

  it('rejects disallowed method in batch before forwarding', async () => {
    const { run, fetchRPC } = setup();
    const res = await run([
      { id: 1, method: 'eth_chainId' },
      { id: 2, method: 'debug_traceCall' },
    ]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      'RPC method debug_traceCall not allowed',
    );
    expect(fetchRPC).not.toHaveBeenCalled();
  });

  it('rejects null item with 400', async () => {
    const { run, fetchRPC } = setup();
    const res = await run([null]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetchRPC).not.toHaveBeenCalled();
  });

  it('strips input and keeps allowlisted override', async () => {
    const { run, sent } = setup({
      allowedCallAddresses: { 1: [ALLOWED] },
      allowedOverrideAddresses: { 1: [ALLOWED] },
    });
    const override = { [ALLOWED]: { stateDiff: { [SLOT]: SLOT } } };
    await run({
      id: 1,
      method: 'eth_call',
      params: [
        { to: ALLOWED, data: '0x', input: '0xdead' },
        'latest',
        override,
      ],
    });
    expect(sent().params).toEqual([
      { to: ALLOWED, data: '0x' },
      'latest',
      override,
    ]);
  });

  it('rejects override address outside allowlist', async () => {
    const { run, fetchRPC } = setup({
      allowedCallAddresses: { 1: [ALLOWED] },
      allowedOverrideAddresses: { 1: [ALLOWED] },
    });
    const res = await run({
      id: 1,
      method: 'eth_call',
      params: [
        { to: ALLOWED },
        'latest',
        { ['0x' + 'cd'.repeat(20)]: { stateDiff: {} } },
      ],
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetchRPC).not.toHaveBeenCalled();
  });

  it('reports disallowed method before params shape', async () => {
    const { run, fetchRPC } = setup();
    const res = await run({ method: 'debug_traceCall', params: {} });
    expect(res.json).toHaveBeenCalledWith(
      'RPC method debug_traceCall not allowed',
    );
    expect(fetchRPC).not.toHaveBeenCalled();
  });

  it('rejects overrides when no override allowlist is set', async () => {
    const { run, fetchRPC } = setup({ allowedCallAddresses: { 1: [ALLOWED] } });
    const res = await run({
      id: 1,
      method: 'eth_call',
      params: [{ to: ALLOWED }, 'latest', { [ALLOWED]: { stateDiff: {} } }],
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetchRPC).not.toHaveBeenCalled();
  });

  it('hides provider error details in 500', async () => {
    const { run, fetchRPC } = setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchRPC.mockRejectedValue(new Error('fail https://user:secret@x'));
    const res = await run({ id: 1, method: 'eth_chainId' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(DEFAULT_API_ERROR_MESSAGE);
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('secret');
    errorSpy.mockRestore();
  });
});
