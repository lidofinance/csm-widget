import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from 'config';
import { useUserConfig } from 'config/user-config';
import { STRATEGY_IMMUTABLE } from 'consts';
import { ClaimBondForm } from 'features/claim-bond/claim-bond-form';
import { ClaimBondDataProvider } from 'features/claim-bond/claim-bond-form/context';
import {
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
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { hashKey } from 'utils';
import { WagmiProvider, useConnect, useConnection } from 'wagmi';
import {
  makeBond,
  makeFeeSplits,
  makeOperatorInfo,
  makeRewards,
  MOCK_CLAIMER,
  MOCK_FRAME,
  MOCK_POOL_DATA,
  MOCK_REWARDS_ADDRESS,
} from './mock-data';
import { createMockWagmiConfig } from './mock-wagmi';
import { type ClaimBondScenarioData } from './scenarios';

// Auto-connects the mock connector on mount so useDappStatus() reports a
// connected address. Renders nothing until connected to avoid a "no-access"
// flash and any SSR/client hydration mismatch (server render is unconnected).
const AutoConnect: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected } = useConnection();
  const { connect, connectors } = useConnect();
  useEffect(() => {
    if (!isConnected && connectors[0]) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connect, connectors]);
  return isConnected ? <>{children}</> : null;
};

// Supplies the node operator context for the stand. Must live inside the
// WagmiProvider so it can read the actually-connected address: it mirrors that
// address onto `managerAddress` so the CLAIMER access gate passes whoever is
// connected — the mock account or a real wallet leaked in from another page
// (wagmi auto-discovers injected wallets and reconnects them from storage).
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
        managerAddress: address ?? MOCK_CLAIMER,
        rewardsAddress: MOCK_REWARDS_ADDRESS,
        extendedManagerPermissions: false,
        curveId: 0n,
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
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          queryKeyHashFn: hashKey,
          retry: false,
          ...STRATEGY_IMMUTABLE,
        },
      },
    });
    const idKey = { nodeOperatorId };
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
