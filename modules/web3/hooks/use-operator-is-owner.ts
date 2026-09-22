import { queryOptions } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import {
  OperatorHookArgs,
  OperatorQueryArgs,
  useOperatorQuery,
} from './use-operator-query';
import { useDappStatus } from './use-dapp-status';

export const KEY_OPERATOR_IS_OWNER = ['operator-is-owner'];

export const operatorIsOwnerQueryOptions = ({
  sdk,
  nodeOperatorId,
  address,
}: OperatorQueryArgs & { address: Address | undefined }) =>
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

export const useOperatorIsOwner = ({
  nodeOperatorId,
  module,
  address: customAddress,
  select,
}: OperatorHookArgs<boolean> & { address?: Address }) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  return useOperatorQuery(
    (args) => operatorIsOwnerQueryOptions({ ...args, address }),
    { nodeOperatorId, module, select },
  );
};
