import { QueryClient } from '@tanstack/react-query';
import { STRATEGY_IMMUTABLE } from 'consts';
import { hashKey } from 'utils';

export const createMockQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: hashKey,
        retry: false,
        ...STRATEGY_IMMUTABLE,
      },
    },
  });
