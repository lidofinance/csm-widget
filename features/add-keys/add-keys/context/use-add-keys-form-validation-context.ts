import { Zero } from '@ethersproject/constants';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useAccount } from 'shared/hooks/use-account';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import type {
  AddKeysFormNetworkData,
  AddKeysFormValidationContext,
} from './types';
import invariant from 'tiny-invariant';

export const useAddKeysFormValidationContext = (
  networkData: AddKeysFormNetworkData,
): Promise<AddKeysFormValidationContext> => {
  const { active } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { etherBalance, isMultisig, gasCost } = networkData;
  const validationContextAwaited = useMemo(() => {
    invariant(nodeOperatorId, 'NodeOperatorId is not defined');
    if (!active || (etherBalance && gasCost && isMultisig)) {
      return {
        isWalletActive: active,
        // condition above guaranties stubs will only be passed when active = false
        etherBalance: etherBalance ?? Zero,
        gasCost: gasCost ?? Zero,
        isMultisig: isMultisig ?? false,
        nodeOperatorId,
      };
    }
    return undefined;
  }, [active, etherBalance, gasCost, isMultisig, nodeOperatorId]);

  return useAwaiter(validationContextAwaited).awaiter;
};
