import {
  appendNodeOperator,
  getNodeOperatorRoles,
  NodeOperator,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddressRoles } from 'shared/node-operator/utils';
import { useDappStatus } from '../hooks';
import { useSmSDK } from '../web3-provider';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = () => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  const { mutate } = useMutation({
    mutationFn: async (value: NodeOperatorShortInfo) => ({
      id: value.nodeOperatorId,
      roles: getAddressRoles(value, address || '0x0'),
    }),
    onSuccess: (data) => {
      queryClient.setQueryData<NodeOperator[]>(
        [...KEY_OPERATORS, { address }],
        (prev = []) => appendNodeOperator(prev, data),
      );
    },
  });

  return mutate;
};

export const useApplyOperator = () => {
  const { operator } = useSmSDK();
  const { address } = useDappStatus();
  const queryClient = useQueryClient();

  // TODO: review
  const { mutateAsync } = useMutation({
    mutationFn: async (id: NodeOperatorId) => {
      const data = await operator.getInfo(id);
      if (!address || !data) return null;

      const roles = getNodeOperatorRoles(data, address);
      if (roles.length > 0) null;

      return { id, roles } as NodeOperator;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.setQueryData<NodeOperator[]>(
        [...KEY_OPERATORS, { address }],
        () => appendNodeOperator([], data),
      );
    },
  });

  return mutateAsync;
};
