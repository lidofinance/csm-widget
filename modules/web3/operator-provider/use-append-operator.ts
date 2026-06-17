import {
  appendNodeOperator,
  MODULE_NAME,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useDappStatus } from '../hooks';
import { useNodeOperator } from './node-operator-provider';
import { CachedOperatorRef } from './types';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = (
  switchOperator?: boolean,
  module?: MODULE_NAME,
) => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();
  const { switchNodeOperator } = useNodeOperator();
  const pendingSwitchRef = useRef<CachedOperatorRef>();

  // Deferred switch: fires after React re-renders with updated operator list
  useEffect(() => {
    if (pendingSwitchRef.current !== undefined) {
      const { id, module: mod } = pendingSwitchRef.current;
      switchNodeOperator(id, mod);
      pendingSwitchRef.current = undefined;
    }
  }, [switchNodeOperator]);

  const { mutate } = useMutation({
    mutationFn: async (value: NodeOperatorShortInfo) => value,
    onSuccess: (data) => {
      queryClient.setQueryData<NodeOperatorShortInfo[]>(
        [...KEY_OPERATORS, { address }],
        (prev = []) => appendNodeOperator(prev, data),
      );
      if (switchOperator && module !== undefined) {
        pendingSwitchRef.current = { id: data.nodeOperatorId, module };
      }
    },
  });

  return mutate;
};
