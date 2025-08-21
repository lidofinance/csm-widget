import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import {
  createMockShareLimit,
  createMockOperatorInfo,
  createMockFormData,
  createMockDepositQueueBatches,
  createMockCurveParams,
  type MockScenarioData,
} from './mock-data';
import {
  NodeOperatorContext,
  NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import { STRATEGY_IMMUTABLE } from 'consts';
import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_OPERATOR_INFO,
  KEY_SHARE_LIMIT,
} from 'modules/web3';
import { hashKey } from 'utils';

// Main mock provider that combines all the mocking
export const MockDepositQueueProvider: FC<
  PropsWithChildren<{ scenario: MockScenarioData }>
> = ({ children, scenario }) => {
  const mockShareLimit = createMockShareLimit(scenario.shareLimit);
  const mockOperatorInfo = createMockOperatorInfo(scenario.operatorInfo);
  const mockFormData = createMockFormData(scenario.formData);
  const mockDepositQueueBatches = scenario.depositQueueBatches
    ? createMockDepositQueueBatches(scenario.depositQueueBatches)
    : null;
  const mockCurveParams = scenario.curveParams
    ? createMockCurveParams(scenario.curveParams)
    : undefined;

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
  queryClient.setQueryData(KEY_SHARE_LIMIT, mockShareLimit);
  queryClient.setQueryData(
    [...KEY_OPERATOR_INFO, { nodeOperatorId: BigInt(scenario.nodeOperatorId) }],
    mockOperatorInfo,
  );
  queryClient.setQueryData(KEY_DEPOSIT_QUEUE_BATCHES, mockDepositQueueBatches);

  // Mock curve parameters if provided
  if (mockCurveParams) {
    const mockCurveId = BigInt(0); // Default curve ID for testing
    // Mock operator curve ID
    queryClient.setQueryData(
      [
        'operator-curve-id',
        { nodeOperatorId: BigInt(scenario.nodeOperatorId) },
      ],
      mockCurveId,
    );
    // Mock curve parameters
    queryClient.setQueryData(
      ['curve-parameters', { curveId: mockCurveId }],
      mockCurveParams,
    );
  }

  // Mock node operator context value
  const mockNodeOperatorContextValue: NodeOperatorContextValue = {
    isPending: false,
    nodeOperator: {
      id: BigInt(scenario.nodeOperatorId),
      // Add other required properties if needed
    } as any,
    switchNodeOperator: () => {}, // Mock function
  };

  // Create form with mock data
  const formMethods = useForm({
    defaultValues: mockFormData,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...formMethods}>
        <NodeOperatorContext.Provider value={mockNodeOperatorContextValue}>
          {children}
        </NodeOperatorContext.Provider>
      </FormProvider>
    </QueryClientProvider>
  );
};

// Note: These mock hooks are not exported as they conflict with the real hooks.
// Instead, the mock data is pre-populated in the QueryClient cache,
// so the real hooks will automatically use the mocked data.
