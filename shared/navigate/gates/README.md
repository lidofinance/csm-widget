# Gates — the routing contract

Everything composes from **two pure primitives**:

- **`evalGuards(guards, state)`** (`route-guards.ts`) — the single guard check.
  Runs a page's `ROUTE_GUARDS` in order and returns a verdict: `ok` (render),
  `pending` (a flag is still loading → splash), or `redirect` (first failing
  rule, default `PATH.HOME`).
- **`resolveTerminal(start, state)`** (`route-terminal.ts`) — loops
  `resolvePath` (forward preference) then `evalGuards` (access) to a fixpoint,
  returning the page the browser will actually **rest on**, or `pending` while
  any flag on the chain is still loading. This is what collapses a redirect to a
  single real browser hop (`/create → /keys/view → /home` becomes one push to
  `/home`) instead of bouncing through each destination's `PageGate`.

`resolveTerminal` calls `evalGuards` at each hop, so the two verdict-consumers
share one guard implementation:

- **`PageGate`** — "can I render THIS page?" — switches on
  `evalGuards(pageGuards, flags)`: `pending`→splash, `redirect`→`<Navigate>`,
  `ok`→children.
- **`<Navigate>`** — "where does the browser finally rest?" — switches on
  `resolveTerminal(path, state)`: `pending`→splash, `ready`→push that page once
  (raw, already final).

Supporting pieces:

- **`resolvePath`** — navigation-time preference (`ROUTE_RESOLUTION` in
  `route-resolution.ts`): a single forward step. Each entry carries explicit
  `deps` — exactly the flags its resolve fn reads — and `resolveTerminal` defers
  (`isResolutionReady`) until they are loaded.
- **`resolveNavigable(path, state)`** (`route-terminal.ts`) — the terminal for
  callers that cannot show a splash. `useCorrectPath` (→ `LocalLink` hrefs) and
  `useNavigate` (imperative) use it: it returns the collapsed terminal once the
  chain is loaded (one hop for clicks too) and falls back to a single
  `resolvePath` step while loading. Correctness never depends on the fallback —
  whatever it lands on, that page's `PageGate` re-validates on live flags.
- **`StubRedirect`** — section index pages (`/keys`, `/bond`, `/settings`,
  `/delayed-penalty`). Applies `PageGate`, then renders `<Navigate path={path}>`;
  the forward target comes from `ROUTE_RESOLUTION`. `resolveTerminal` needs no
  stub list — `resolvePath` forwards a stub every hop and never *returns* one
  (both asserted in the consistency test), so `current` never rests on a stub.
  The stub list lives only in the test simulator (`__tests__/test-helpers.ts`).
- **Self-redirect pattern** — a guard may redirect a path to itself (e.g.
  `TYPE`, `TYPE_ICS_CLAIM`, `TYPE_DVT_CLAIM`) when the path's resolution rule
  mirrors the guard and never returns that path under the failing flag state —
  `resolveTerminal` applies `resolvePath` and always makes progress.
- **`Gate`** — inline content switching only (show/hide by a `ShowRule`).
  Never use it for page access.
- **`GateSupported`** — contract-version check, renders the unsupported page.

Content-switch pages (`pages/index.tsx`) render their `useShowRule` switch
*inside* `PageGate`, so the gate's initial-load splash precedes the checks —
during load the flags read as `false` and an unguarded switch would flash the
wrong page.

## Tests

`__tests__/test-helpers.ts` exposes `simulateLoad(entry, flags)` — a faithful
replay of the PageGate/StubRedirect/`<Navigate>` render loop on the *production*
primitives, returning `{ terminal, pushes }`.

- `route-consistency.test.ts` — over every reachable flag state: `resolveTerminal`
  settles on an accessible non-stub page, loads never loop, every flag a resolve
  fn reads is declared in its `deps`, every stub resolves away from itself, no
  rule resolves *to* a stub (this licenses dropping the stub check), and a
  snapshot documents navigate-vs-direct divergences.
- `route-hops.test.ts` — counts the real `router.push` calls via `simulateLoad`
  and proves every page in every reachable state pushes **at most once**; also
  covers loading-defer and `resolveNavigable`'s fallback.
