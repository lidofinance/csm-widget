import { PATH } from 'consts/urls';
import type { ShowFlags, ShowFlagsState, ShowRule } from 'shared/hooks';

export type ResolveRule = {
  deps: ShowRule[];
  resolve: (flags: ShowFlags) => PATH;
};

export const hasRole = (flags: ShowFlags) =>
  flags.HAS_MANAGER_ROLE || flags.HAS_REWARDS_ROLE;

// Navigation-time preference — ONLY section-index preference and
// operator-scoped in-section rewrites; access fallbacks live in ROUTE_GUARDS.
// `deps` lists exactly the flags the resolve fn reads — <Navigate> defers the
// push until every one of them is loaded (see navigate.tsx); the deps test in
// __tests__/route-consistency.test.ts keeps the lists from drifting
export const ROUTE_RESOLUTION: Partial<Record<PATH, ResolveRule>> = {
  // Keys
  [PATH.KEYS]: {
    deps: ['HAS_MANAGER_ROLE', 'HAS_REWARDS_ROLE', 'HAS_KEYS'],
    resolve: (flags) =>
      hasRole(flags)
        ? flags.HAS_KEYS || !flags.HAS_MANAGER_ROLE
          ? PATH.KEYS_VIEW
          : PATH.KEYS_SUBMIT
        : PATH.CREATE,
  },
  // operator-scoped: non-operators fall through to the guard chain
  [PATH.KEYS_SUBMIT]: {
    deps: ['IS_NODE_OPERATOR', 'HAS_MANAGER_ROLE'],
    resolve: (flags) =>
      flags.IS_NODE_OPERATOR && !flags.HAS_MANAGER_ROLE
        ? PATH.KEYS_VIEW
        : PATH.KEYS_SUBMIT,
  },
  [PATH.KEYS_REMOVE]: {
    deps: ['IS_NODE_OPERATOR', 'HAS_MANAGER_ROLE'],
    resolve: (flags) =>
      flags.IS_NODE_OPERATOR && !flags.HAS_MANAGER_ROLE
        ? PATH.KEYS_EXIT
        : PATH.KEYS_REMOVE,
  },

  // Bond
  [PATH.BOND]: {
    deps: ['HAS_MANAGER_ROLE', 'HAS_REWARDS_ROLE'],
    resolve: (flags) => (hasRole(flags) ? PATH.BOND_CLAIM : PATH.HOME),
  },

  // Settings
  [PATH.SETTINGS]: {
    deps: ['HAS_MANAGER_ROLE', 'HAS_REWARDS_ROLE'],
    resolve: (flags) =>
      hasRole(flags) ? PATH.SETTINGS_ROLES : PATH.SETTINGS_INBOX,
  },

  // Delayed penalty — section index is a pure forward
  [PATH.DELAYED_PENALTY]: {
    deps: [],
    resolve: () => PATH.DELAYED_PENALTY_REPORT,
  },

  // Type/ICS — flag-based
  [PATH.TYPE]: {
    deps: [
      'ICS_APPLY_ENABLED',
      'CAN_CLAIM_ICS',
      'CAN_CLAIM_IDVTC',
      'HAS_MANAGER_ROLE',
      'HAS_REWARDS_ROLE',
    ],
    resolve: (flags) => {
      if (!flags.ICS_APPLY_ENABLED) {
        return flags.CAN_CLAIM_ICS && hasRole(flags)
          ? PATH.TYPE_ICS_CLAIM
          : flags.CAN_CLAIM_IDVTC && hasRole(flags)
            ? PATH.TYPE_DVT_CLAIM
            : PATH.TYPE_PARAMETERS;
      }
      return PATH.TYPE;
    },
  },
  [PATH.TYPE_ICS_PARAMETERS]: {
    deps: ['ICS_APPLY_ENABLED'],
    resolve: (flags) =>
      flags.ICS_APPLY_ENABLED ? PATH.TYPE_ICS_PARAMETERS : PATH.TYPE_PARAMETERS,
  },
  [PATH.TYPE_DVT_PARAMETERS]: {
    deps: ['ICS_APPLY_ENABLED'],
    resolve: (flags) =>
      flags.ICS_APPLY_ENABLED ? PATH.TYPE_DVT_PARAMETERS : PATH.TYPE_PARAMETERS,
  },
  // operator-scoped: non-operators land on the info pages — mirror of the
  // guard rule, so resolution never returns the claim path when
  // IS_NODE_OPERATOR is false and <Navigate> always makes progress
  [PATH.TYPE_ICS_CLAIM]: {
    deps: ['IS_NODE_OPERATOR', 'ICS_APPLY_ENABLED'],
    resolve: (flags) =>
      !flags.IS_NODE_OPERATOR
        ? flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_ICS_SYSTEM
          : PATH.TYPE_PARAMETERS
        : PATH.TYPE_ICS_CLAIM,
  },
  [PATH.TYPE_DVT_CLAIM]: {
    deps: ['IS_NODE_OPERATOR', 'ICS_APPLY_ENABLED'],
    resolve: (flags) =>
      !flags.IS_NODE_OPERATOR
        ? flags.ICS_APPLY_ENABLED
          ? PATH.TYPE_DVT_DESCRIPTION
          : PATH.TYPE_PARAMETERS
        : PATH.TYPE_DVT_CLAIM,
  },
};

export const resolvePath = (path: PATH, flags: ShowFlags): PATH =>
  ROUTE_RESOLUTION[path]?.resolve(flags) ?? path;

// True once every flag the path's resolution rule reads is loaded; paths
// without a resolution rule are always ready
export const isResolutionReady = (path: PATH, state: ShowFlagsState): boolean =>
  (ROUTE_RESOLUTION[path]?.deps ?? []).every(
    (rule) => state[rule] !== undefined,
  );
