import { MODULE_NAME, type NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { QueryClientProvider } from '@tanstack/react-query';
import { useUserConfig } from 'config/user-config';
import {
  KEY_CUSTOM_REWARDS_CLAIMER,
  KEY_FEE_SPLITS,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_GROUP,
  KEY_OPERATOR_GROUP_ID,
  KEY_OPERATOR_GROUP_SUMMARY,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_METADATA,
  KEY_OPERATOR_REWARDS,
  KEY_OPERATOR_STAKE_INFO,
  KEY_OPERATOR_WEIGHT,
  KEY_OPERATORS,
  KEY_STETH_POOL_DATA,
  KEY_TOP_UP_ALLOCATION,
} from 'modules/web3';
import {
  NodeOperatorContext,
  type NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import { FC, PropsWithChildren, useMemo } from 'react';
import { zeroAddress } from 'viem';
import { WagmiProvider } from 'wagmi';
import {
  makeBond,
  makeFeeSplits,
  makeOperatorInfo,
  makeRewards,
  MOCK_POOL_DATA,
} from '../claim-bond/mock-data';
import { createMockWagmiConfig } from '../claim-bond/mock-wagmi';
import { AutoConnect } from '../shared/auto-connect';
import { createMockQueryClient } from '../shared/create-mock-query-client';
import { VARIANTS, type DashboardVariant } from './variants';

export const MockDashboardProvider: FC<
  PropsWithChildren<{ variant: DashboardVariant }>
> = ({ variant, children }) => {
  const { defaultChain } = useUserConfig();
  const record = VARIANTS[variant];

  const wagmiConfig = useMemo(
    () => createMockWagmiConfig(defaultChain, record.wallet),
    [defaultChain, record],
  );

  const queryClient = useMemo(() => {
    const client = createMockQueryClient();
    const { operator, cm } = record;
    const idKey = {
      nodeOperatorId: operator.nodeOperatorId,
      module: operator.module,
    };
    const {
      managerAddress,
      rewardsAddress,
      proposedManagerAddress,
      proposedRewardsAddress,
      ...rest
    } = record.info;

    client.setQueryData(
      [...KEY_OPERATORS, { address: record.wallet }],
      [operator],
    );
    client.setQueryData([...KEY_OPERATOR_KEYS, idKey], record.keys);
    client.setQueryData(
      [...KEY_OPERATOR_BALANCE, idKey],
      makeBond(record.bond),
    );
    client.setQueryData(
      [...KEY_OPERATOR_REWARDS, idKey],
      makeRewards(record.rewardsAvailable),
    );
    client.setQueryData(
      [...KEY_FEE_SPLITS, idKey],
      makeFeeSplits(...record.feeSplits),
    );
    client.setQueryData(
      [...KEY_CUSTOM_REWARDS_CLAIMER, idKey],
      record.claimer ?? zeroAddress,
    );
    client.setQueryData([...KEY_OPERATOR_INFO, idKey], {
      ...makeOperatorInfo({
        managerAddress,
        rewardsAddress,
        proposedManagerAddress,
        proposedRewardsAddress,
      }),
      ...rest,
    } as NodeOperatorInfo);
    client.setQueryData([...KEY_OPERATOR_CURVE_ID, idKey], {
      curveId: operator.curveId,
      module: operator.module,
    });
    client.setQueryData(['operator-last-rewards', idKey], record.lastRewards);
    client.setQueryData(
      ['last-report-timestamps', { module: operator.module }],
      record.timestamps,
    );
    client.setQueryData(
      ['last-report-tx-hash', { module: operator.module }],
      record.txHash,
    );
    client.setQueryData(
      ['frame-info', { module: operator.module }],
      record.frame,
    );
    client.setQueryData([...KEY_STETH_POOL_DATA], MOCK_POOL_DATA);

    if (cm) {
      const cmKey = {
        nodeOperatorId: operator.nodeOperatorId,
        module: MODULE_NAME.CM,
      };
      client.setQueryData([...KEY_OPERATOR_GROUP_ID, cmKey], cm.groupId);
      client.setQueryData([...KEY_OPERATOR_GROUP, cmKey], cm.group);
      client.setQueryData([...KEY_OPERATOR_GROUP_SUMMARY, cmKey], cm.group);
      client.setQueryData([...KEY_OPERATOR_WEIGHT, cmKey], cm.stake.weight);
      client.setQueryData([...KEY_OPERATOR_STAKE_INFO, cmKey], cm.stake);
      client.setQueryData([...KEY_TOP_UP_ALLOCATION, cmKey], cm.topUpEnabled);
      client.setQueryData([...KEY_OPERATOR_METADATA, cmKey], {
        name: cm.metadataName,
        description: cm.description,
        ownerEditsRestricted: false,
      });
    }

    return client;
  }, [record]);

  const nodeOperatorValue: NodeOperatorContextValue = useMemo(
    () => ({
      isPending: false,
      needsSelection: false,
      isDiscovering: false,
      dismissSelection: () => {},
      requestSelection: () => {},
      nodeOperator: record.operator,
      activeModule: record.operator.module,
      switchNodeOperator: () => {},
    }),
    [record],
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect>
          <NodeOperatorContext.Provider value={nodeOperatorValue}>
            {children}
          </NodeOperatorContext.Provider>
        </AutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
