import { ROLES } from 'consts/roles';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
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
  const nodeOperator = useActiveNodeOperator();
  const isRole = nodeOperator?.roles.includes(role);

  return <>{!isRole ? fallback : children}</>;
};
