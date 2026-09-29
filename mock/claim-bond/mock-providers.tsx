import { QueryClientProvider } from '@tanstack/react-query';
import { config } from 'config';
import { useUserConfig } from 'config/user-config';
import { ClaimBondForm } from 'features/claim-bond/claim-bond-form';
import { ClaimBondDataProvider } from 'features/claim-bond/claim-bond-form/context';
import {
  KEY_CUSTOM_REWARDS_CLAIMER,
  KEY_FEE_SPLITS,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_REWARDS,
  KEY_STETH_POOL_DATA,
  useDappStatus,
} from 'modules/web3';
import {
  NodeOperatorContext,
  type NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import { FC, PropsWithChildren, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { AutoConnect } from '../shared/auto-connect';
import { createMockQueryClient } from '../shared/create-mock-query-client';
import {
  makeBond,
  makeFeeSplits,
  makeOperatorInfo,
  makeRewards,
  MOCK_CLAIMER,
  MOCK_FRAME,
  MOCK_MANAGER,
  MOCK_POOL_DATA,
  MOCK_REWARDS_ADDRESS,
} from './mock-data';
import { createMockWagmiConfig } from './mock-wagmi';
import { type ClaimBondScenarioData } from './scenarios';

// Mirrors the connected address onto `claimerAddress` (not manager/rewards) so
// the stand exercises the CLAIMER access path end to end.
const MockOperatorProvider: FC<
  PropsWithChildren<{ nodeOperatorId: bigint }>
> = ({ nodeOperatorId, children }) => {
  const { address } = useDappStatus();

  const operatorCtx: NodeOperatorContextValue = useMemo(
    () => ({
      isPending: false,
      needsSelection: false,
      nodeOperator: {
        nodeOperatorId,
        managerAddress: MOCK_MANAGER,
        rewardsAddress: MOCK_REWARDS_ADDRESS,
        extendedManagerPermissions: false,
        curveId: 0n,
        claimerAddress: address ?? MOCK_CLAIMER,
        module: config.module,
      },
      activeModule: config.module,
      switchNodeOperator: () => {},
    }),
    [nodeOperatorId, address],
  );

  return (
    <NodeOperatorContext.Provider value={operatorCtx}>
      {children}
    </NodeOperatorContext.Provider>
  );
};

export const MockClaimBondProvider: FC<
  PropsWithChildren<{ scenario: ClaimBondScenarioData }>
> = ({ scenario, children }) => {
  const { defaultChain } = useUserConfig();
  const nodeOperatorId = BigInt(scenario.nodeOperatorId ?? 1);

  const wagmiConfig = useMemo(
    () => createMockWagmiConfig(defaultChain, MOCK_CLAIMER),
    [defaultChain],
  );

  const queryClient = useMemo(() => {
    const client = createMockQueryClient();
    const idKey = { nodeOperatorId, module: config.module };
    client.setQueryData(
      [...KEY_OPERATOR_BALANCE, idKey],
      makeBond(scenario.bond),
    );
    client.setQueryData(
      [...KEY_OPERATOR_REWARDS, idKey],
      makeRewards(scenario.rewards ?? 0),
    );
    client.setQueryData(
      [...KEY_OPERATOR_INFO, idKey],
      makeOperatorInfo({ rewardsAddress: MOCK_REWARDS_ADDRESS }),
    );
    client.setQueryData(
      [...KEY_FEE_SPLITS, idKey],
      scenario.feeSplits ? makeFeeSplits(...scenario.feeSplits) : [],
    );
    client.setQueryData([...KEY_CUSTOM_REWARDS_CLAIMER, idKey], MOCK_CLAIMER);
    client.setQueryData([...KEY_STETH_POOL_DATA], MOCK_POOL_DATA);
    client.setQueryData(['sm-status'], {
      isPausedModule: false,
      isPausedAccounting: !!scenario.isPaused,
    });
    client.setQueryData(['frame-info'], MOCK_FRAME);
    client.setQueryData(
      ['use-is-contract', MOCK_REWARDS_ADDRESS],
      !!scenario.isContract,
    );
    return client;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect>
          <MockOperatorProvider nodeOperatorId={nodeOperatorId}>
            <ClaimBondForm />
            {children && (
              <ClaimBondDataProvider>{children}</ClaimBondDataProvider>
            )}
          </MockOperatorProvider>
        </AutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
