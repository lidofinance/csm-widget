const {
  standardFetcher,
  isAddressDenied,
  isDenyListConfigured,
  serverConfig,
  config,
} = vi.hoisted(() => ({
  standardFetcher: vi.fn(),
  isAddressDenied: vi.fn(),
  isDenyListConfigured: vi.fn(),
  serverConfig: { validationAPI: undefined as string | undefined },
  config: { defaultChain: 560048 },
}));

vi.mock('utils/standard-fetcher', () => ({ standardFetcher }));
vi.mock('utilsApi/load-validation-file', () => ({
  isAddressDenied,
  isDenyListConfigured,
}));
vi.mock('utilsApi/server-config', () => ({
  getServerConfig: () => serverConfig,
}));
vi.mock('config', () => ({ config }));
vi.mock('utilsApi/external-metrics', () => ({
  responseTimeExternalMetricWrapper: ({
    request,
  }: {
    request: () => unknown;
  }) => request(),
}));

import { resolveAddressValidity } from '../address-validity';
import { FetcherError } from 'utils/fetcher-error';

const ADDR = '0x0000000000000000000000000000000000000001';
const SERVICE = 'https://validation.example';

const verdict = (isValid: boolean) => ({ status: 'ok', isValid });

const sentHeaders = () =>
  Object.fromEntries(new Headers(standardFetcher.mock.calls[0][1].headers));

describe('resolveAddressValidity', () => {
  beforeEach(() => {
    standardFetcher.mockReset();
    isAddressDenied.mockReset();
    isAddressDenied.mockResolvedValue(false);
    isDenyListConfigured.mockReset();
    isDenyListConfigured.mockReturnValue(true);
    serverConfig.validationAPI = SERVICE;
    config.defaultChain = 560048;
  });

  describe('with the service configured', () => {
    test.each([[false], [true]])(
      'service verdict isValid=%s wins over the file',
      async (isValid) => {
        standardFetcher.mockResolvedValue({ isValid });
        isAddressDenied.mockResolvedValue(true);
        expect(await resolveAddressValidity(ADDR, {})).toEqual(
          verdict(isValid),
        );
        expect(isAddressDenied).not.toHaveBeenCalled();
      },
    );

    test.each([
      ['500', new FetcherError('boom', 500)],
      ['403', new FetcherError('nope', 403)],
      ['timeout', new DOMException('timed out', 'TimeoutError')],
      ['network', new TypeError('fetch failed')],
    ])('falls back to the file on %s', async (_n, err) => {
      standardFetcher.mockRejectedValue(err);
      isAddressDenied.mockResolvedValue(true);
      expect(await resolveAddressValidity(ADDR, {})).toEqual(verdict(false));
    });

    test.each([[{}], [{ isValid: 'false' }], [null]])(
      'falls back to the file on a malformed service body: %o',
      async (body) => {
        standardFetcher.mockResolvedValue(body);
        isAddressDenied.mockResolvedValue(true);
        expect(await resolveAddressValidity(ADDR, {})).toEqual(verdict(false));
      },
    );

    test('passes an upstream 429 through without reading the file', async () => {
      standardFetcher.mockRejectedValue(new FetcherError('slow down', 429));
      expect(await resolveAddressValidity(ADDR, {})).toEqual({
        status: 'rate-limited',
      });
      expect(isAddressDenied).not.toHaveBeenCalled();
    });

    test('is unavailable when the service fails and no file is configured', async () => {
      standardFetcher.mockRejectedValue(new FetcherError('boom', 500));
      isDenyListConfigured.mockReturnValue(false);
      expect(await resolveAddressValidity(ADDR, {})).toEqual({
        status: 'unavailable',
      });
      expect(isAddressDenied).not.toHaveBeenCalled();
    });

    test('uses the file verdict when the service fails and a file is configured', async () => {
      standardFetcher.mockRejectedValue(new FetcherError('boom', 500));
      isAddressDenied.mockResolvedValue(false);
      expect(await resolveAddressValidity(ADDR, {})).toEqual(verdict(true));
    });

    test.each([
      [560048, `${SERVICE}/v1/check/${ADDR}`],
      [1, `${SERVICE}/v2/check/${ADDR}`],
    ])('chain %i calls %s', async (chain, url) => {
      config.defaultChain = chain;
      standardFetcher.mockResolvedValue({ isValid: true });
      await resolveAddressValidity(ADDR, {});
      expect(standardFetcher.mock.calls[0][0]).toBe(url);
    });

    test('forwards client headers; fixed headers cannot be overridden', async () => {
      standardFetcher.mockResolvedValue({ isValid: true });
      await resolveAddressValidity(ADDR, {
        'X-Client-IP': '1.2.3.4',
        Accept: 'text/html',
      });
      expect(sentHeaders()).toMatchObject({
        'x-client-ip': '1.2.3.4',
        accept: 'application/json',
        'content-type': 'application/json',
      });
    });
  });

  describe('without the service', () => {
    beforeEach(() => {
      serverConfig.validationAPI = undefined;
    });

    test.each([
      [true, false],
      [false, true],
    ])('listed=%s → isValid=%s', async (listed, isValid) => {
      isAddressDenied.mockResolvedValue(listed);
      expect(await resolveAddressValidity(ADDR, {})).toEqual(verdict(isValid));
      expect(standardFetcher).not.toHaveBeenCalled();
    });
  });
});
