import { useNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';

type Props = {
  fallback?: ReactNode;
};

export const GateNodeOperator: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { active } = useNodeOperator();

  return <>{!active ? fallback : children}</>;
};
