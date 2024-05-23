import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useAccount } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { NodeOperatorId, NodeOperatorInvite, NodeOperatorRoles } from 'types';
import { useGetActiveNodeOperator } from './use-get-active-node-operator';
import { useNodeOperatorInvitesFromEvents } from './use-node-operator-invites-from-events';
import { useNodeOperatorsFromEvents } from './use-node-operators-from-events';

export type NodeOperatorContextValue = {
  list: NodeOperatorRoles[];
  isListLoading: boolean;
  append: (no: NodeOperatorRoles) => void;
  active?: NodeOperatorRoles;
  switchActive: (id: NodeOperatorId) => void;
  invites: NodeOperatorInvite[];
  isInvitesLoading: boolean;
};

export const NodeOperatorContext =
  createContext<NodeOperatorContextValue | null>(null);

export const useNodeOperator = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value;
};

export const useNodeOperatorId = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return value.active?.id;
};

export const useNodeOperatorRoles = () => {
  const value = useContext(NodeOperatorContext);
  invariant(
    value,
    'useNodeOperator was used outside the NodeOperatorContext provider',
  );
  return { rewards: value.active?.rewards, manager: value.active?.manager };
};

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();

  const {
    data: list,
    initialLoading: isListLoading,
    append,
  } = useNodeOperatorsFromEvents(address || undefined);

  const { active, switchActive } = useGetActiveNodeOperator(list);

  const { data: invites, initialLoading: isInvitesLoading } =
    useNodeOperatorInvitesFromEvents(address || undefined);

  const value = useMemo(
    () => ({
      list,
      active,
      invites,
      isListLoading,
      isInvitesLoading,
      append,
      switchActive,
    }),
    [
      list,
      active,
      invites,
      isListLoading,
      isInvitesLoading,
      append,
      switchActive,
    ],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};
