import { useNodeOperatorRoles } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';

type Props = {
  fallback?: ReactNode;
};

export const GateRoleRewards: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { rewards } = useNodeOperatorRoles();

  if (!rewards) return fallback;

  return children;
};

export const GateRoleManager: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { manager } = useNodeOperatorRoles();

  if (!manager) return fallback;

  return children;
};
