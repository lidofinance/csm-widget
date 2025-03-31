import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { NodeOperator } from 'types';
import { useAppendAndSwitch } from './use-appen-and-switch';
import { useGetActiveNodeOperator } from './use-get-active-node-operator';
import { useNodeOperatorsList } from './use-node-operators-list';

export type NodeOperatorContextValue = {
  list: NodeOperator[];
  isListLoading: boolean;
  active?: NodeOperator;
  append: ReturnType<typeof useNodeOperatorsList>['append'];
  switchActive: ReturnType<typeof useGetActiveNodeOperator>['switchActive'];
  appendAndSwitch: ReturnType<typeof useAppendAndSwitch>;
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
  const { active, setActive, switchActive } = useGetActiveNodeOperator(list);
  const appendAndSwitch = useAppendAndSwitch(append, setActive);

  const value = useMemo(
    () => ({
      list,
      active,
      isListLoading,
      append,
      switchActive,
      appendAndSwitch,
    }),
    [list, active, isListLoading, append, switchActive, appendAndSwitch],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
