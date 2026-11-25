import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, ReactNode, useRef } from 'react';
import { ShowRule, useShowRule } from 'shared/hooks';
import { resolveLatch } from './latch';

type GateProps = {
  fallback?: ReactNode;
  rule: ShowRule;
  /** Keep rendering children once the rule has passed, until the connected address changes */
  latch?: boolean;
};

export const Gate: FC<PropsWithChildren<GateProps>> = ({
  fallback,
  children,
  rule,
  latch,
}) => {
  const check = useShowRule();
  const { address } = useDappStatus();
  const latchedForRef = useRef<string | undefined>(undefined);
  const canShow = check(rule);

  let show = canShow;
  if (latch) {
    // render-time ref write is safe: resolveLatch is idempotent for equal inputs
    const next = resolveLatch(latchedForRef.current, canShow, address);
    latchedForRef.current = next.latchedFor;
    show = next.show;
  }

  return <>{show ? children : fallback}</>;
};
