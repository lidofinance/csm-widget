import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, ReactNode, useEffect } from 'react';
import { useShowFlagsState } from 'shared/hooks';
import { resolveTerminal } from './gates/route-terminal';
import { SplashPage } from './inner-pages';

type Props = { path: PATH; fallback?: ReactNode };

// A redirect collapses to a single real browser hop. Instead of pushing one
// step and letting each destination's PageGate push again (create -> keys ->
// home = 2 visible hops), resolveTerminal walks the whole resolution + guard
// chain up front and returns the page the browser will actually rest on, which
// we push once — already final, so raw (no resolvePath re-correction). While
// any flag on the chain is still loading it returns `pending` and we hold the
// splash rather than bounce through an intermediate URL.
export const Navigate: FC<Props> = ({ path, fallback = <SplashPage /> }) => {
  const { push } = useRouter();
  const { hashNav } = useInpageNavigation();
  const state = useShowFlagsState();

  const terminal = resolveTerminal(path, state);
  const target = terminal.status === 'ready' ? terminal.path : undefined;

  useEffect(() => {
    if (target) void push(target + (hashNav ? `#${hashNav}` : ''));
  }, [push, hashNav, target]);

  return <>{fallback}</>;
};
