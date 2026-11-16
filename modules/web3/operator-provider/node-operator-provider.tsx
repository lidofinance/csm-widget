import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useConnectionEffect } from 'wagmi';
import invariant from 'tiny-invariant';
import { useDappStatus } from '../hooks';
import { useRegisterForgetCachedOperator } from './forget-cached-operator';
import { useActiveNodeOperator } from './use-active-node-operator';
import { useAvailableOperators } from './use-available-operators';
import { ModuleNodeOperator, OperatorRef } from './types';

export type NodeOperatorContextValue = {
  isPending: boolean;
  nodeOperator: ModuleNodeOperator | undefined;
  activeModule: MODULE_NAME | undefined;
  needsSelection: boolean;
  isDiscovering: boolean;
  dismissSelection: () => void;
  requestSelection: () => void;
  switchNodeOperator: (operator: OperatorRef) => void;
};

export type NodeOperatorDefinedContextValue = NodeOperatorContextValue & {
  nodeOperator: ModuleNodeOperator;
  activeModule: MODULE_NAME;
};

export const NodeOperatorContext =
  createContext<NodeOperatorContextValue | null>(null);

export const useNodeOperator = <
  TDefined extends boolean = false,
>(): TDefined extends true
  ? NodeOperatorDefinedContextValue
  : NodeOperatorContextValue => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value as any;
};

export const useNodeOperatorId = <
  TDefined extends boolean = false,
>(): TDefined extends true ? NodeOperatorId : NodeOperatorId | undefined => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperatorId was used outside the NodeOperatorContext provider',
  );
  return value.nodeOperator?.nodeOperatorId as any;
};

export const NodeOperatorProvider: FC<PropsWithChildren> = ({ children }) => {
  useRegisterForgetCachedOperator();
  const { data: list, isPending, isPlaceholderData } = useAvailableOperators();
  const {
    nodeOperator: active,
    setActive,
    needsSelection,
    hasCachedPick,
    dismissSelection,
    requestSelection,
  } = useActiveNodeOperator(list);
  const { isAccountActive } = useDappStatus();
  const [isBooting, setBooting] = useState(true);

  useConnectionEffect({
    onConnect: useCallback(({ isReconnected }: { isReconnected: boolean }) => {
      if (!isReconnected) setBooting(false);
    }, []),
  });

  useEffect(() => {
    if (isAccountActive && !isPending && !isPlaceholderData) setBooting(false);
  }, [isAccountActive, isPending, isPlaceholderData]);

  const isDiscovering =
    !isBooting && isAccountActive && isPending && !hasCachedPick;

  const switchNodeOperator = useCallback(
    ({ nodeOperatorId, module }: OperatorRef) => {
      const newActive = list?.find(
        (item) =>
          item.nodeOperatorId === nodeOperatorId && item.module === module,
      );
      if (newActive) setActive(newActive);
    },
    [list, setActive],
  );

  const value = useMemo(
    () => ({
      isPending,
      nodeOperator: active,
      activeModule: active?.module,
      needsSelection,
      isDiscovering,
      dismissSelection,
      requestSelection,
      switchNodeOperator,
    }),
    [
      active,
      isPending,
      needsSelection,
      isDiscovering,
      dismissSelection,
      requestSelection,
      switchNodeOperator,
    ],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
