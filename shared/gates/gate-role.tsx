import { ROLES } from 'consts/roles';
import { useNodeOperatorRoles } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';

type Props = {
  fallback?: ReactNode;
  role: ROLES;
};

export const GateRole: FC<PropsWithChildren<Props>> = ({
  role,
  fallback,
  children,
}) => {
  const { manager, rewards } = useNodeOperatorRoles();
  const isRole = role === ROLES.MANAGER ? manager : rewards;

  return <>{!isRole ? fallback : children}</>;
};
