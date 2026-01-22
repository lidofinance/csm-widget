import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createMockWrappedStats,
  type MockWrappedScenarioData,
} from './mock-data';
import {
  NodeOperatorContext,
  NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import { STRATEGY_IMMUTABLE } from 'consts';
import { hashKey } from 'utils';

export const MockWrappedProvider: FC<
  PropsWithChildren<{ scenario: MockWrappedScenarioData }>
> = ({ children, scenario }) => {
  const mockWrappedStats = createMockWrappedStats(scenario.stats);

  // Create a unique QueryClient for this scenario to avoid cache conflicts
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: hashKey,
        retry: false,
        ...STRATEGY_IMMUTABLE,
      },
    },
  });

  // Pre-populate the query cache with mock data
  queryClient.setQueryData(
    ['wrapped', { nodeOperatorId: BigInt(scenario.nodeOperatorId) }],
    mockWrappedStats,
  );

  // Mock node operator context value
  const mockNodeOperatorContextValue: NodeOperatorContextValue = {
    isPending: false,
    nodeOperator: {
      id: BigInt(scenario.nodeOperatorId),
    } as any,
    switchNodeOperator: () => {},
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NodeOperatorContext.Provider value={mockNodeOperatorContextValue}>
        {children}
      </NodeOperatorContext.Provider>
    </QueryClientProvider>
  );
};
