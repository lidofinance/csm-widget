import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNodeOperatorInvitesFromEvents } from 'shared/hooks/useNodeOperatorInvitesFromEvents';
import { useNodeOperatorsFromEvents } from 'shared/hooks/useNodeOperatorsFromEvents';
import { useReadNodeOperatorInfo } from 'shared/hooks/useReadNodeOperatorInfo';
import { NodeOperatorId, NodeOperatorInvite, NodeOperatorRoles } from 'types';
import { useAccount } from 'wagmi';

export type NodeOperatorContextValue = {
  list: NodeOperatorRoles[];
  isLoading: boolean;
  append: (no: NodeOperatorRoles) => void;
  active?: NodeOperatorRoles;
  switchActive: (id: NodeOperatorId) => void;
  details?: ReturnType<typeof useReadNodeOperatorInfo>['data'];
  isDetailsLoading: boolean;
  invites: NodeOperatorInvite[];
  isInvitesLoading: boolean;
};

export const NodeOperatorContext = createContext<NodeOperatorContextValue>({
  list: [],
  invites: [],
  isLoading: false,
  isInvitesLoading: false,
  isDetailsLoading: false,
  append: () => {},
  switchActive: () => {},
});

export const useNodeOperator = () => useContext(NodeOperatorContext);

const useGetActiveNodeOperator = (roles: NodeOperatorRoles[]) => {
  // @todo: cache in LocalStorage
  const [active, setActive] = useState<NodeOperatorRoles | undefined>();

  useEffect(() => {
    if (roles.length === 0 && !!active) {
      setActive(undefined);
    }
    if (roles.length > 0 && !active) {
      setActive(roles[0]);
    }
  }, [active, roles]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const active = roles.find((roles) => roles.id === id);
      if (active) setActive(active);
    },
    [roles],
  );

  return { active, switchActive };
};

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { address, isConnected } = useAccount();

  const {
    data: list,
    initialLoading: isLoading,
    append,
  } = useNodeOperatorsFromEvents((isConnected && address) || undefined);

  const { active, switchActive } = useGetActiveNodeOperator(list);

  const { data: details, initialLoading: isDetailsLoading } =
    useReadNodeOperatorInfo(active?.id);

  const { data: invites, initialLoading: isInvitesLoading } =
    useNodeOperatorInvitesFromEvents((isConnected && address) || undefined);

  const value = useMemo(
    () => ({
      list,
      active,
      details,
      invites,
      isLoading,
      isDetailsLoading,
      isInvitesLoading,
      append,
      switchActive,
    }),
    [
      list,
      active,
      details,
      invites,
      isLoading,
      isDetailsLoading,
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
