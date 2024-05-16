import { Zero } from '@ethersproject/constants';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useAccount } from 'shared/hooks/use-account';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import type {
  RemoveKeysFormNetworkData,
  RemoveKeysFormValidationContext,
} from './types';
import invariant from 'tiny-invariant';

export const useRemoveKeysFormValidationContext = (
  networkData: RemoveKeysFormNetworkData,
): Promise<RemoveKeysFormValidationContext> => {
  const { active } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { isMultisig, gasCost } = networkData;
  const validationContextAwaited = useMemo(() => {
    invariant(nodeOperatorId, 'NodeOperatorId is not defined');
    if (!active || (gasCost && isMultisig)) {
      return {
        isWalletActive: active,
        // condition above guaranties stubs will only be passed when active = false
        gasCost: gasCost ?? Zero,
        isMultisig: isMultisig ?? false,
        nodeOperatorId,
      };
    }
    return undefined;
  }, [active, gasCost, isMultisig, nodeOperatorId]);

  return useAwaiter(validationContextAwaited).awaiter;
};
