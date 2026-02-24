import {
  appendNodeOperator,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDappStatus } from '../hooks';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = () => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  const { mutate } = useMutation({
    mutationFn: async (value: NodeOperatorShortInfo) => value,
    onSuccess: (data) => {
      queryClient.setQueryData<NodeOperatorShortInfo[]>(
        [...KEY_OPERATORS, { address }],
        (prev = []) => appendNodeOperator(prev, data),
      );
    },
  });

  return mutate;
};
