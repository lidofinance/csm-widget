import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { NodeOperator, NodeOperatorId, NodeOperatorRoles } from 'types';
import { useGetActiveNodeOperator } from './use-get-active-node-operator';
import { useNodeOperatorsList } from './use-node-operators-list';

export type NodeOperatorContextValue = {
  list: NodeOperator[];
  isListLoading: boolean;
  append: (nodeOperator: NodeOperatorRoles) => void;
  active?: NodeOperator;
  switchActive: (id: NodeOperatorId) => void;
};

export const NodeOperatorContext =
  createContext<NodeOperatorContextValue | null>(null);

export const useNodeOperatorContext = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value;
};

// TODO: invariant id by param
export const useNodeOperatorId = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value.active?.id;
};

export const useActiveNodeOperator = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value.active;
};

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { list, isListLoading, append } = useNodeOperatorsList();
  const { active, switchActive } = useGetActiveNodeOperator(list);

  const value = useMemo(
    () => ({
      list,
      active,
      isListLoading,
      append,
      switchActive,
    }),
    [list, active, isListLoading, append, switchActive],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
