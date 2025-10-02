import {
  appendNodeOperator,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { NodeOperator, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';

export const useAppendOperator = () => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  const { mutate } = useMutation({
    mutationFn: async (value: NodeOperator) => value,
    onSuccess: (data) => {
      queryClient.setQueryData<NodeOperator[]>(
        ['node-operators', { address }],
        (prev = []) => appendNodeOperator(prev, data),
      );
    },
  });

  return mutate;
};

export const useApplyOperator = () => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (id: NodeOperatorId) => {
      const data = await csm.operator.getInfo(id);
      if (!address || !data) return null;

      const roles = getNodeOperatorRoles(data, address);
      if (roles.length > 0) null;

      return { id, roles } as NodeOperator;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.setQueryData<NodeOperator[]>(
        ['node-operators', { address }],
        () => appendNodeOperator([], data),
      );
    },
  });

  return mutateAsync;
};
