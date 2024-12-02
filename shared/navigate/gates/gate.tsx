import { FC, PropsWithChildren, ReactNode } from 'react';
import { ShowRule, useShowRule } from 'shared/hooks';

type GateProps = {
  fallback?: ReactNode;
  rule: ShowRule;
};

export const Gate: FC<PropsWithChildren<GateProps>> = ({
  fallback,
  children,
  rule,
}) => {
  const check = useShowRule();
  const canShow = check(rule);

  return <>{canShow ? children : fallback}</>;
};
