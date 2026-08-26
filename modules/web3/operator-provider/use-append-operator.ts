import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDappStatus } from '../hooks';
import { appendModuleOperator } from './merge-operators';
import { ModuleNodeOperator } from './types';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = (module: MODULE_NAME) => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  const { mutate } = useMutation({
    mutationFn: async (value: NodeOperatorShortInfo) => value,
    onSuccess: (data) => {
      const tagged: ModuleNodeOperator = { ...data, module };
      queryClient.setQueryData<ModuleNodeOperator[]>(
        [...KEY_OPERATORS, { address }],
        (prev = []) => appendModuleOperator(prev, tagged),
      );
    },
  });

  return mutate;
};
