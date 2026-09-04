import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDappStatus } from '../hooks';
import { appendModuleOperator } from './merge-operators';
import { ModuleNodeOperator } from './types';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = () => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();

  const { mutate } = useMutation({
    mutationFn: async (value: ModuleNodeOperator) => value,
    onSuccess: (tagged) => {
      queryClient.setQueryData<ModuleNodeOperator[]>(
        [...KEY_OPERATORS, { address }],
        (prev = []) => appendModuleOperator(prev, tagged),
      );
    },
  });

  return mutate;
};
