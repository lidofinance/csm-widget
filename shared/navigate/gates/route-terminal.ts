import { PATH } from 'consts/urls';
import type { ShowFlagsState } from 'shared/hooks';
import { coerceShowFlags } from 'utils/coerce-show-flags';
import { evalGuards, ROUTE_GUARDS } from './route-guards';
import { isResolutionReady, resolvePath } from './route-resolution';

export type TerminalResult =
  | { status: 'ready'; path: PATH }
  | { status: 'pending' };

// Defensive bound — route-consistency.test.ts proves the graph never loops, so
// this is only a runaway backstop.
const HOP_CAP = 10;

// The page the browser rests on when it starts navigating toward `start`. Loops
// the two primitives — resolvePath (forward preference) then evalGuards (access)
// — to a fixpoint, so a redirect can push the final page in ONE real hop instead
// of bouncing through each intermediate PageGate. Tri-state aware: returns
// `pending` the moment a flag it must read is still loading, so <Navigate> holds
// the splash rather than guess a terminal.
//
// No stub check is needed: resolvePath runs at the top of every hop and never
// returns a stub (route-consistency.test.ts asserts both), so `current` is
// never a stub at the rest decision — the stub-forward is just the next hop's
// resolvePath, exactly as <Navigate path={stub}> behaves in the browser.
export const resolveTerminal = (
  start: PATH,
  state: ShowFlagsState,
): TerminalResult => {
  const flags = coerceShowFlags(state);
  let current = start;

  for (let hop = 0; hop <= HOP_CAP; hop += 1) {
    if (!isResolutionReady(current, state)) return { status: 'pending' };
    current = resolvePath(current, flags);

    const verdict = evalGuards(ROUTE_GUARDS[current] ?? [], state);
    if (verdict.status === 'pending') return { status: 'pending' };
    if (verdict.status === 'redirect') {
      current = verdict.to;
      continue;
    }
    return { status: 'ready', path: current };
  }

  return { status: 'ready', path: current };
};

// Best-effort terminal for callers that cannot show a splash — imperative
// navigation (useNavigate) and hrefs (LocalLink). Returns the collapsed terminal
// once the chain is loaded (one hop), and falls back to a single resolution step
// while it is still loading (today's behavior). Correctness is never at stake:
// whatever we land on, its PageGate re-validates on live flags.
export const resolveNavigable = (path: PATH, state: ShowFlagsState): PATH => {
  const terminal = resolveTerminal(path, state);
  return terminal.status === 'ready'
    ? terminal.path
    : resolvePath(path, coerceShowFlags(state));
};
