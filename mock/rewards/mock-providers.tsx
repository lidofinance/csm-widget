import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMockRewardsHistory, type MockScenarioData } from './mock-data';
import {
  NodeOperatorContext,
  NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import { STRATEGY_IMMUTABLE } from 'consts';
import { KEY_OPERATOR_REWARDS_HISTORY } from 'modules/web3';
import { hashKey } from 'utils';

export const MockRewardsHistoryProvider: FC<
  PropsWithChildren<{ scenario: MockScenarioData }>
> = ({ children, scenario }) => {
  const mockRewardsHistory = createMockRewardsHistory(scenario.rewardsHistory);

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
    [
      ...KEY_OPERATOR_REWARDS_HISTORY,
      { nodeOperatorId: BigInt(scenario.nodeOperatorId) },
    ],
    mockRewardsHistory,
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
