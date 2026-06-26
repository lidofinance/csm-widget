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
import { useActiveNodeOperator } from './use-active-node-operator';
import { useAvailableOperators } from './use-available-operators';
import { ModuleNodeOperator } from './types';

export type NodeOperatorContextValue = {
  isPending: boolean;
  nodeOperator: ModuleNodeOperator | undefined;
  activeModule: MODULE_NAME | undefined;
  switchNodeOperator: (id: NodeOperatorId, module: MODULE_NAME) => void;
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
  const { data: list, isPending } = useAvailableOperators();
  const [active, setActive] = useActiveNodeOperator(list);

  const switchNodeOperator = useCallback(
    (id: NodeOperatorId, module: MODULE_NAME) => {
      const newActive = list?.find(
        (item) => item.nodeOperatorId === id && item.module === module,
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
      switchNodeOperator,
    }),
    [active, isPending, switchNodeOperator],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
