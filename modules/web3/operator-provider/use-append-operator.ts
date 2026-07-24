import {
  appendNodeOperator,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useDappStatus } from '../hooks';
import { useNodeOperator } from './node-operator-provider';
import { KEY_OPERATORS } from './use-available-operators';

export const useAppendOperator = (switchOperator?: boolean) => {
  const queryClient = useQueryClient();
  const { address } = useDappStatus();
  const { switchNodeOperator } = useNodeOperator();
  const pendingSwitchRef = useRef<NodeOperatorId>();

  // Deferred switch: fires after React re-renders with updated operator list
  useEffect(() => {
    if (pendingSwitchRef.current !== undefined) {
      switchNodeOperator(pendingSwitchRef.current);
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
      if (switchOperator) {
        pendingSwitchRef.current = data.nodeOperatorId;
      }
    },
  });

  return mutate;
};
