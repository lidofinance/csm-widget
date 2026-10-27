const standardFetcher = jest.fn();

jest.mock('utils', () => {
  const { FetcherError } = jest.requireActual('utils/fetcher-error');
  return {
    FetcherError,
    standardFetcher: (...args: unknown[]) => standardFetcher(...args),
  };
});
jest.mock('config', () => ({
  config: { addressApiValidationEnabled: true, ipfsMode: false },
}));
jest.mock('consts/api', () => ({
  API_ROUTES: { VALIDATION: 'api/validation' },
}));
jest.mock('react', () => ({
  useCallback: (fn: unknown) => fn,
}));
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    fetchQuery: ({ queryFn }: { queryFn: () => Promise<unknown> }) => queryFn(),
  }),
}));

import { useApiAddressValidation } from '../use-api-address-validation';
import { FetcherError } from 'utils/fetcher-error';

const ADDR = '0x0000000000000000000000000000000000000001' as const;

describe('useApiAddressValidation', () => {
  beforeEach(() => {
    standardFetcher.mockReset();
  });

  test('returns invalid on a 429', async () => {
    standardFetcher.mockRejectedValue(new FetcherError('x', 429));
    expect(await useApiAddressValidation()(ADDR)).toEqual({ isValid: false });
  });

  test.each([
    ['403', new FetcherError('x', 403)],
    ['500', new FetcherError('x', 500)],
    ['network', new TypeError('fetch failed')],
  ])('returns null (fallback) on %s', async (_n, err) => {
    standardFetcher.mockRejectedValue(err);
    expect(await useApiAddressValidation()(ADDR)).toBeNull();
  });

  test('returns API result on success', async () => {
    standardFetcher.mockResolvedValue({ isValid: true });
    expect(await useApiAddressValidation()(ADDR)).toEqual({ isValid: true });
  });
});
