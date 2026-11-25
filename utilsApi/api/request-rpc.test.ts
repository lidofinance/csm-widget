import { redactUrls, requestRpcFactory } from './request-rpc';

const makeRes = (status: number, cancelImpl?: () => Promise<void>) => {
  const res = new Response('{}', { status });
  const cancel = vi.fn(cancelImpl ?? (() => Promise.resolve()));
  Object.defineProperty(res, 'body', { value: { cancel } });
  return { res, cancel };
};

const setup = (
  outcomes: Array<Response | Error>,
  urls: [string, ...string[]] = ['http://a', 'http://b'],
) => {
  let i = 0;
  const fetchRPC = vi.fn(() => {
    const next = outcomes[i++];
    return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
  });
  const request = requestRpcFactory({
    providers: { 1: urls },
    fetchRPC: fetchRPC as any,
  });
  return { request, fetchRPC };
};

const body = { id: 1, jsonrpc: '2.0', method: 'eth_chainId' } as any;

describe('requestRpcFactory', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => errorSpy.mockRestore());

  it('cancels failed-over response and returns the ok one', async () => {
    const bad = makeRes(503);
    const good = makeRes(200);
    const { request } = setup([bad.res, good.res]);
    await expect(request(1, body)).resolves.toBe(good.res);
    expect(bad.cancel).toHaveBeenCalled();
    expect(good.cancel).not.toHaveBeenCalled();
  });

  it('returns last non-ok response uncancelled', async () => {
    const first = makeRes(503);
    const last = makeRes(502);
    const { request } = setup([first.res, last.res]);
    await expect(request(1, body)).resolves.toBe(last.res);
    expect(first.cancel).toHaveBeenCalled();
    expect(last.cancel).not.toHaveBeenCalled();
  });

  it('rethrows last error when all providers throw', async () => {
    const { request } = setup([new Error('one'), new Error('two')]);
    await expect(request(1, body)).rejects.toThrow('two');
  });

  it('swallows cancel rejection', async () => {
    const bad = makeRes(503, () => Promise.reject(new Error('boom')));
    const good = makeRes(200);
    const { request } = setup([bad.res, good.res]);
    await expect(request(1, body)).resolves.toBe(good.res);
  });

  it('does not log credentialed urls', async () => {
    const { request } = setup([
      new Error('fail https://user:secret@x/path'),
      new Error('fail https://user:secret@y'),
    ]);
    await request(1, body).catch(() => undefined);
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain('secret');
    expect(logged).toContain('<url>');
  });
});

describe('redactUrls', () => {
  it('masks whole urls', () => {
    expect(redactUrls('at https://u:p@host/v2/KEY?k=1 end')).toBe(
      'at <url> end',
    );
  });
});
