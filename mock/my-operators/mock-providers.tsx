import { MODULE_NAME, type NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { QueryClientProvider } from '@tanstack/react-query';
import { useUserConfig } from 'config/user-config';
import {
  KEY_FEE_SPLITS,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_GROUP_ID,
  KEY_OPERATOR_GROUP_SUMMARY,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_METADATA,
  KEY_OPERATOR_REWARDS,
  KEY_OPERATORS,
  KEY_STETH_POOL_DATA,
} from 'modules/web3';
import {
  NodeOperatorContext,
  type NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import type { OperatorRef } from 'modules/web3/operator-provider/types';
import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { AutoConnect } from '../shared/auto-connect';
import { createMockQueryClient } from '../shared/create-mock-query-client';
import {
  makeBond,
  makeOperatorInfo,
  makeRewards,
  MOCK_MANAGER,
  MOCK_POOL_DATA,
} from '../claim-bond/mock-data';
import { createMockWagmiConfig } from '../claim-bond/mock-wagmi';
import {
  VARIANTS,
  type MyOperatorsVariant,
  type OperatorSeed,
  type VariantRecord,
} from './variants';

const ADDRESS = MOCK_MANAGER;

// Local NodeOperatorContext whose switchNodeOperator flips the active card,
// mirroring the real provider without hitting the network.
const MockOperatorProvider: FC<
  PropsWithChildren<{ record: VariantRecord }>
> = ({ record, children }) => {
  const [active, setActive] = useState<OperatorRef>(record.active);

  const switchNodeOperator = useCallback((operator: OperatorRef) => {
    setActive(operator);
  }, []);

  const nodeOperator = useMemo(
    () =>
      record.available.find(
        (op) =>
          op.nodeOperatorId === active.nodeOperatorId &&
          op.module === active.module,
      ),
    [active, record],
  );

  const value: NodeOperatorContextValue = useMemo(
    () => ({
      isPending: false,
      needsSelection: false,
      isDiscovering: false,
      dismissSelection: () => {},
      requestSelection: () => {},
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

export const MockMyOperatorsProvider: FC<
  PropsWithChildren<{ variant?: MyOperatorsVariant }>
> = ({ variant = 'csm-many', children }) => {
  const { defaultChain } = useUserConfig();
  const record = VARIANTS[variant];

  const wagmiConfig = useMemo(
    () => createMockWagmiConfig(defaultChain, ADDRESS),
    [defaultChain],
  );

  const queryClient = useMemo(() => {
    const client = createMockQueryClient();

    client.setQueryData(
      [...KEY_OPERATORS, { address: ADDRESS }],
      record.available,
    );

    const seedOperator = ({
      operator,
      keys,
      bond,
      rewardsAvailable,
      info,
    }: OperatorSeed) => {
      const idKey = {
        nodeOperatorId: operator.nodeOperatorId,
        module: operator.module,
      };
      const {
        managerAddress,
        rewardsAddress,
        proposedManagerAddress,
        ...rest
      } = info;
      client.setQueryData([...KEY_OPERATOR_KEYS, idKey], keys);
      client.setQueryData([...KEY_OPERATOR_BALANCE, idKey], makeBond(bond));
      client.setQueryData(
        [...KEY_OPERATOR_REWARDS, idKey],
        makeRewards(rewardsAvailable),
      );
      client.setQueryData([...KEY_FEE_SPLITS, idKey], []);
      client.setQueryData([...KEY_OPERATOR_INFO, idKey], {
        ...makeOperatorInfo({
          managerAddress,
          rewardsAddress,
          proposedManagerAddress,
        }),
        ...rest,
      } as NodeOperatorInfo);
      client.setQueryData([...KEY_OPERATOR_CURVE_ID, idKey], {
        curveId: operator.curveId,
        module: operator.module,
      });
    };

    record.csm.forEach(seedOperator);

    record.cm.forEach((seed) => {
      seedOperator(seed);
      const idKey = {
        nodeOperatorId: seed.operator.nodeOperatorId,
        module: MODULE_NAME.CM,
      };
      const summary = record.groups.find((g) => g.groupId === seed.groupId);
      client.setQueryData([...KEY_OPERATOR_GROUP_ID, idKey], seed.groupId);
      client.setQueryData(
        [...KEY_OPERATOR_GROUP_SUMMARY, idKey],
        summary ?? null,
      );
      client.setQueryData([...KEY_OPERATOR_METADATA, idKey], {
        name: seed.metadataName,
        description: '',
        ownerEditsRestricted: false,
      });
    });

    client.setQueryData([...KEY_STETH_POOL_DATA], MOCK_POOL_DATA);

    return client;
  }, [record]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect>
          <MockOperatorProvider record={record}>
            {children}
          </MockOperatorProvider>
        </AutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
