import {
  KEY_STATUS,
  KeyWithStatus,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';
import { QueryClientProvider } from '@tanstack/react-query';
import { useUserConfig } from 'config/user-config';
import {
  KEY_FEE_SPLITS,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_REWARDS,
  KEY_OPERATORS,
  KEY_STETH_POOL_DATA,
} from 'modules/web3';
import {
  NodeOperatorContext,
  type NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import type {
  ModuleNodeOperator,
  OperatorRef,
} from 'modules/web3/operator-provider/types';
import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { parseEther } from 'viem';
import { WagmiProvider } from 'wagmi';
import { AutoConnect } from '../shared/auto-connect';
import { createMockQueryClient } from '../shared/create-mock-query-client';
import {
  makeBond,
  makeOperatorInfo,
  makeRewards,
  MOCK_CLAIMER,
  MOCK_MANAGER,
  MOCK_POOL_DATA,
  MOCK_REWARDS_ADDRESS,
  type RawBond,
} from '../claim-bond/mock-data';
import { createMockWagmiConfig } from '../claim-bond/mock-wagmi';

const ADDRESS = MOCK_MANAGER;

const OPERATORS: ModuleNodeOperator[] = [
  {
    nodeOperatorId: 37n,
    module: MODULE_NAME.CSM_02,
    managerAddress: ADDRESS,
    rewardsAddress: ADDRESS,
    extendedManagerPermissions: false,
    curveId: 0n,
  },
  {
    nodeOperatorId: 38n,
    module: MODULE_NAME.CSM,
    managerAddress: ADDRESS,
    rewardsAddress: MOCK_REWARDS_ADDRESS,
    extendedManagerPermissions: false,
    curveId: 1n,
  },
  {
    nodeOperatorId: 40n,
    module: MODULE_NAME.CSM,
    managerAddress: MOCK_REWARDS_ADDRESS,
    rewardsAddress: ADDRESS,
    extendedManagerPermissions: false,
    curveId: 0n,
  },
];

const key = (
  index: number,
  statuses: KEY_STATUS[],
  effectiveBalance?: bigint,
): KeyWithStatus => ({
  pubkey: `0x${index.toString(16).padStart(96, '0')}`,
  index,
  statuses,
  effectiveBalance,
});

// Builds a flat KeyWithStatus[] from status groups, keeping per-operator indices unique.
const keysFor = (
  groups: {
    count: number;
    statuses: KEY_STATUS[];
    effectiveBalance?: bigint;
  }[],
) => {
  let i = 0;
  return groups.flatMap(({ count, statuses, effectiveBalance }) =>
    Array.from({ length: count }, () => key(i++, statuses, effectiveBalance)),
  );
};

// 37: fully active, effectiveBalance set so the CSM_02 keys row shows an ETH balance.
const KEYS_37 = keysFor([
  { count: 2, statuses: [KEY_STATUS.DEPOSITABLE] },
  {
    count: 10,
    statuses: [KEY_STATUS.ACTIVE],
    effectiveBalance: parseEther('32'),
  },
]);

// 38: one pending-activation key plus one WITH_STRIKES and one UNBONDED key → 2 issues.
const KEYS_38 = keysFor([
  { count: 1, statuses: [KEY_STATUS.ACTIVATION_PENDING] },
  { count: 10, statuses: [KEY_STATUS.ACTIVE] },
  { count: 1, statuses: [KEY_STATUS.WITH_STRIKES] },
  { count: 1, statuses: [KEY_STATUS.UNBONDED] },
]);

const KEYS_40 = keysFor([{ count: 3, statuses: [KEY_STATUS.ACTIVE] }]);

const DEFAULT_ACTIVE: OperatorRef = {
  nodeOperatorId: 37n,
  module: MODULE_NAME.CSM_02,
};

// Local NodeOperatorContext whose switchNodeOperator flips the active card,
// mirroring the real provider without hitting the network.
const MockOperatorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [active, setActive] = useState<OperatorRef>(DEFAULT_ACTIVE);

  const switchNodeOperator = useCallback((operator: OperatorRef) => {
    setActive(operator);
  }, []);

  const nodeOperator = useMemo(
    () =>
      OPERATORS.find(
        (op) =>
          op.nodeOperatorId === active.nodeOperatorId &&
          op.module === active.module,
      ),
    [active],
  );

  const value: NodeOperatorContextValue = useMemo(
    () => ({
      isPending: false,
      needsSelection: false,
      nodeOperator,
      activeModule: nodeOperator?.module,
      switchNodeOperator,
    }),
    [nodeOperator, switchNodeOperator],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};

export const MockMyOperatorsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { defaultChain } = useUserConfig();

  const wagmiConfig = useMemo(
    () => createMockWagmiConfig(defaultChain, ADDRESS),
    [defaultChain],
  );

  const queryClient = useMemo(() => {
    const client = createMockQueryClient();

    client.setQueryData([...KEY_OPERATORS, { address: ADDRESS }], OPERATORS);

    const seedOperator = (
      operator: ModuleNodeOperator,
      keys: KeyWithStatus[],
      bond: RawBond,
      rewardsAvailable: number,
      infoOverrides: Parameters<typeof makeOperatorInfo>[0],
    ) => {
      const idKey = {
        nodeOperatorId: operator.nodeOperatorId,
        module: operator.module,
      };
      client.setQueryData([...KEY_OPERATOR_KEYS, idKey], keys);
      client.setQueryData([...KEY_OPERATOR_BALANCE, idKey], makeBond(bond));
      client.setQueryData(
        [...KEY_OPERATOR_REWARDS, idKey],
        makeRewards(rewardsAvailable),
      );
      client.setQueryData([...KEY_FEE_SPLITS, idKey], []);
      client.setQueryData(
        [...KEY_OPERATOR_INFO, idKey],
        makeOperatorInfo(infoOverrides),
      );
      client.setQueryData([...KEY_OPERATOR_CURVE_ID, idKey], {
        curveId: operator.curveId,
        module: operator.module,
      });
    };

    seedOperator(OPERATORS[0], KEYS_37, { current: 40, forKeys: 32 }, 0.5, {
      managerAddress: ADDRESS,
      rewardsAddress: ADDRESS,
    });
    seedOperator(OPERATORS[1], KEYS_38, { current: 9.8, forKeys: 10 }, 0.2, {
      managerAddress: ADDRESS,
      rewardsAddress: MOCK_REWARDS_ADDRESS,
      proposedManagerAddress: MOCK_CLAIMER,
    });
    seedOperator(OPERATORS[2], KEYS_40, { current: 10, forKeys: 9 }, 0.1, {
      managerAddress: MOCK_REWARDS_ADDRESS,
      rewardsAddress: ADDRESS,
    });

    client.setQueryData([...KEY_STETH_POOL_DATA], MOCK_POOL_DATA);

    return client;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect>
          <MockOperatorProvider>{children}</MockOperatorProvider>
        </AutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
