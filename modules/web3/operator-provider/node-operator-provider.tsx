import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { useRegisterForgetCachedOperator } from './forget-cached-operator';
import { useActiveNodeOperator } from './use-active-node-operator';
import { useAvailableOperators } from './use-available-operators';
import { ModuleNodeOperator, OperatorRef } from './types';

export type NodeOperatorContextValue = {
  isPending: boolean;
  nodeOperator: ModuleNodeOperator | undefined;
  activeModule: MODULE_NAME | undefined;
  needsSelection: boolean;
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
  const { data: list, isPending } = useAvailableOperators();
  const {
    nodeOperator: active,
    setActive,
    needsSelection,
  } = useActiveNodeOperator(list);

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
    // needsSelection folds into isPending so GateLoaded keeps a SplashPage under the modal
    // instead of flashing StarterPackPage/CmWelcomePage and redirecting via NOT_NODE_OPERATOR
    () => ({
      isPending: isPending || needsSelection,
      nodeOperator: active,
      activeModule: active?.module,
      needsSelection,
      switchNodeOperator,
    }),
    [active, isPending, needsSelection, switchNodeOperator],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
