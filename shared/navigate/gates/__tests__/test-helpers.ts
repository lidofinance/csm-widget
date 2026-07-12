import { PATH } from 'consts/urls';
import type { ShowFlags, ShowFlagsState, ShowRule } from 'shared/hooks';
import { evalGuards, ROUTE_GUARDS } from '../route-guards';
import { hasRole } from '../route-resolution';
import { resolveTerminal } from '../route-terminal';

// Section-index pages whose pages/*/index.tsx renders <StubRedirect>: they hold
// no content and forward via resolvePath. Only the browser simulator needs this
// (a stub page renders a real <Navigate>); production resolveTerminal does not,
// because resolvePath forwards a stub every hop. Invariants enforced in
// route-consistency.test.ts: a stub never resolves to itself, and no rule
// resolves TO a stub.
export const STUB_PATHS: readonly PATH[] = [
  PATH.SETTINGS,
  PATH.KEYS,
  PATH.BOND,
  PATH.DELAYED_PENALTY,
];

export const makeFlags = (overrides: Partial<ShowFlags> = {}): ShowFlags => ({
  IS_MAINNET: false,
  IS_CONNECTED_WALLET: false,
  NOT_NODE_OPERATOR: false,
  IS_NODE_OPERATOR: false,
  CAN_CREATE: false,
  HAS_KEYS: false,
  HAS_INVITES: false,
  HAS_MANAGER_ROLE: false,
  HAS_REWARDS_ROLE: false,
  HAS_OWNER_ROLE: false,
  HAS_LOCKED_BOND: false,
  HAS_REFERRER: false,
  EL_DELAYED_PENALTY_REPORTER: false,
  CAN_CLAIM_ICS: false,
  CAN_CLAIM_IDVTC: false,
  ICS_APPLY_ENABLED: false,
  IS_SURVEYS_ACTIVE: false,
  IS_CSM: false,
  IS_CM: false,
  ...overrides,
});

export const HOP_CAP = 10;

export type LoadResult = { terminal: PATH; pushes: number; looped: boolean };

// What a freshly-loaded page renders, mirroring the components exactly:
//   PageGate     -> pending guard shows splash (no push); a failing guard
//                   renders <Navigate path={redirect}>
//   StubRedirect -> a stub whose guards pass renders <Navigate path={self}>
//   content page -> guards pass, not a stub: no <Navigate>, the browser rests
// Returns the <Navigate> arg, or null when the page renders no redirect.
export const navigateArgOf = (
  page: PATH,
  state: ShowFlagsState,
): PATH | null => {
  const verdict = evalGuards(ROUTE_GUARDS[page] ?? [], state);
  if (verdict.status === 'pending') return null; // splash, no push
  if (verdict.status === 'redirect') return verdict.to;
  if (STUB_PATHS.includes(page)) return page;
  return null;
};

// Replays a direct page load at `entry` the way the browser does: each
// <Navigate> fires one router.push(resolveTerminal(arg)), the browser re-renders
// the pushed page, and it may redirect again. Counts the REAL router.push()
// calls — the hop count a user watches in the URL bar — and returns where it
// rests.
export const simulateLoad = (
  entry: PATH,
  state: ShowFlagsState,
): LoadResult => {
  let page = entry;
  let pushes = 0;
  for (let hop = 0; hop < HOP_CAP; hop += 1) {
    const arg = navigateArgOf(page, state);
    if (arg === null) return { terminal: page, pushes, looped: false };
    const target = resolveTerminal(arg, state);
    if (target.status !== 'ready') {
      return { terminal: page, pushes, looped: false }; // splash while loading
    }
    page = target.path;
    pushes += 1;
  }
  return { terminal: page, pushes, looped: true };
};

export const VARY: readonly ShowRule[] = [
  'IS_CONNECTED_WALLET',
  'IS_NODE_OPERATOR',
  'HAS_MANAGER_ROLE',
  'HAS_REWARDS_ROLE',
  'HAS_OWNER_ROLE',
  'HAS_KEYS',
  'HAS_INVITES',
  'CAN_CREATE',
  'ICS_APPLY_ENABLED',
  'CAN_CLAIM_ICS',
  'CAN_CLAIM_IDVTC',
  'EL_DELAYED_PENALTY_REPORTER',
  'IS_SURVEYS_ACTIVE',
  'IS_MAINNET',
];

// Mirrors the derivations in shared/hooks/use-show-rule.ts: states that the
// real useShowFlags can never produce are excluded from the universe.
export const isPossibleState = (flags: ShowFlags): boolean => {
  const needsWallet =
    flags.IS_NODE_OPERATOR ||
    flags.HAS_MANAGER_ROLE ||
    flags.HAS_REWARDS_ROLE ||
    flags.HAS_OWNER_ROLE ||
    flags.CAN_CLAIM_ICS ||
    flags.CAN_CLAIM_IDVTC ||
    flags.CAN_CREATE;
  if (needsWallet && !flags.IS_CONNECTED_WALLET) return false;
  // Invites are fetched for the connected address
  if (flags.HAS_INVITES && !flags.IS_CONNECTED_WALLET) return false;
  if (
    (flags.HAS_MANAGER_ROLE ||
      flags.HAS_REWARDS_ROLE ||
      flags.HAS_OWNER_ROLE) &&
    !flags.IS_NODE_OPERATOR
  ) {
    return false;
  }
  // The active operator comes from discovery.getNodeOperatorsByAddress, which
  // only returns operators where the address holds the manager or rewards
  // role — so in steady state an active operator implies at least one role.
  // (Excludes transient mid-session role-revocation states.)
  if (flags.IS_NODE_OPERATOR && !hasRole(flags)) {
    return false;
  }
  if (flags.HAS_OWNER_ROLE && !hasRole(flags)) {
    return false;
  }
  if (flags.HAS_KEYS && !flags.IS_NODE_OPERATOR) return false;
  // useCanClaimICS/useCanClaimIDVTC read proofs via useSmSDK(MODULE_NAME.CSM)
  // (undefined on CM builds) and require nodeOperatorId + isOwner — so a
  // claimable type implies CSM module and an owner-role operator
  if (
    (flags.CAN_CLAIM_ICS || flags.CAN_CLAIM_IDVTC) &&
    !(flags.IS_CSM && flags.IS_NODE_OPERATOR && flags.HAS_OWNER_ROLE)
  ) {
    return false;
  }
  return !(
    (flags.ICS_APPLY_ENABLED || flags.IS_SURVEYS_ACTIVE) &&
    !flags.IS_CSM
  );
};

export const buildStates = (): ShowFlags[] => {
  const states: ShowFlags[] = [];
  for (const moduleName of ['csm', 'cm'] as const) {
    for (let mask = 0; mask < 1 << VARY.length; mask += 1) {
      const overrides: Partial<ShowFlags> = {
        IS_CSM: moduleName === 'csm',
        IS_CM: moduleName === 'cm',
      };
      VARY.forEach((rule, index) => {
        overrides[rule] = Boolean(mask & (1 << index));
      });
      overrides.NOT_NODE_OPERATOR = !overrides.IS_NODE_OPERATOR;
      const flags = makeFlags(overrides);
      if (isPossibleState(flags)) states.push(flags);
    }
  }
  return states;
};

export const trueFlags = (flags: ShowFlags): string =>
  (Object.keys(flags) as ShowRule[]).filter((rule) => flags[rule]).join('+') ||
  'none';
