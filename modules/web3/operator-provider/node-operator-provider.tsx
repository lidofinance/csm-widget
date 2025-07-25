import { NodeOperator, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
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

export type NodeOperatorContextValue = {
  isPending: boolean;
  nodeOperator: NodeOperator | undefined;
  switchNodeOperator: (id: NodeOperatorId) => void;
};

export type NodeOperatorDefinedContextValue = NodeOperatorContextValue & {
  nodeOperator: NodeOperator;
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
  return value.nodeOperator?.id as any;
};

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { data: list, isPending } = useAvailableOperators();
  const [active, setActive] = useActiveNodeOperator(list);

  const switchNodeOperator = useCallback(
    (id: NodeOperatorId) => {
      const newActive = list?.find((item) => item.id === id);
      if (newActive) {
        setActive(newActive);
      }
    },
    [list, setActive],
  );

  const value = useMemo(
    () => ({ isPending, nodeOperator: active, switchNodeOperator }),
    [active, isPending, switchNodeOperator],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
