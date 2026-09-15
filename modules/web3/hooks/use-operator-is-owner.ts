import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { SmSDK, useTargetSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const KEY_OPERATOR_IS_OWNER = ['operator-is-owner'];

export const operatorIsOwnerQueryOptions = (
  sdk: SmSDK | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
  address: Address | undefined,
) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_IS_OWNER,
      { address, nodeOperatorId, module: sdk?.core.moduleName },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk && address && nodeOperatorId !== undefined);
      return sdk.operator.isOwner(nodeOperatorId, address);
    },
    enabled: !!sdk && !!address && nodeOperatorId !== undefined,
  });

export const useOperatorIsOwner = (
  nodeOperatorId: NodeOperatorId | undefined,
  customAddress?: Address,
  module?: MODULE_NAME,
) => {
  const { address: dappAddress } = useDappStatus();
  const { sdk } = useTargetSmSDK(module);
  return useQuery(
    operatorIsOwnerQueryOptions(
      sdk,
      nodeOperatorId,
      customAddress ?? dappAddress,
    ),
  );
};
