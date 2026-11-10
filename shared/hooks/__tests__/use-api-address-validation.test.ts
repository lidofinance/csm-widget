const { standardFetcher, config } = vi.hoisted(() => ({
  standardFetcher: vi.fn(),
  config: { addressValidationEnabled: true },
}));

vi.mock('utils', async () => {
  const { FetcherError } = await import('utils/fetcher-error');
  return { FetcherError, standardFetcher };
});
vi.mock('config', () => ({ config }));
vi.mock('consts/api', () => ({
  API_ROUTES: { VALIDATION: 'api/validation' },
}));
vi.mock('react', () => ({
  useCallback: (fn: unknown) => fn,
}));
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => queryClient,
}));

import { QueryClient } from '@tanstack/react-query';
import { useApiAddressValidation } from '../use-api-address-validation';
import { FetcherError } from 'utils/fetcher-error';

const queryClient = new QueryClient();
const ADDR = '0x0000000000000000000000000000000000000001' as const;

describe('useApiAddressValidation', () => {
  beforeEach(() => {
    standardFetcher.mockReset();
    config.addressValidationEnabled = true;
    queryClient.clear();
  });

  test.each([[true], [false]])('returns the verdict isValid=%s', async (v) => {
    standardFetcher.mockResolvedValue({ isValid: v });
    expect(await useApiAddressValidation()(ADDR)).toBe(v);
  });

  test('429 is invalid without retry', async () => {
    standardFetcher.mockRejectedValue(new FetcherError('x', 429));
    expect(await useApiAddressValidation()(ADDR)).toBe(false);
    expect(standardFetcher).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['500', new FetcherError('x', 500)],
    ['403', new FetcherError('x', 403)],
    ['network', new TypeError('fetch failed')],
  ])('%s is invalid after one retry', async (_n, err) => {
    standardFetcher.mockRejectedValue(err);
    expect(await useApiAddressValidation()(ADDR)).toBe(false);
    expect(standardFetcher).toHaveBeenCalledTimes(2);
  });

  test('body without boolean isValid is invalid', async () => {
    standardFetcher.mockResolvedValue({});
    expect(await useApiAddressValidation()(ADDR)).toBe(false);
  });

  test('validation disabled is valid without fetching', async () => {
    config.addressValidationEnabled = false;
    expect(await useApiAddressValidation()(ADDR)).toBe(true);
    expect(standardFetcher).not.toHaveBeenCalled();
  });

  test('a failure is not cached', async () => {
    const validate = useApiAddressValidation();
    standardFetcher.mockRejectedValue(new FetcherError('x', 429));
    expect(await validate(ADDR)).toBe(false);
    standardFetcher.mockResolvedValue({ isValid: true });
    expect(await validate(ADDR)).toBe(true);
  });
});
