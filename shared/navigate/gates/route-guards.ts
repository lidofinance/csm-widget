import { PATH } from 'consts/urls';
import type { ShowFlagsState, ShowRule } from 'shared/hooks';

export type RouteGuard = {
  rule: ShowRule;
  redirect?: PATH; // defaults to PATH.HOME
};

export type GuardVerdict =
  | { status: 'ok' } // every guard passes — render the page
  | { status: 'pending' } // a guard's flag is still loading — show the splash
  | { status: 'redirect'; to: PATH }; // first failing guard — go here

// Guards are evaluated in order: the first failing rule wins its redirect,
// and a rule whose data is still loading shows the splash screen
export const ROUTE_GUARDS: Partial<Record<PATH, RouteGuard[]>> = {
  [PATH.CREATE]: [
    { rule: 'IS_CONNECTED_WALLET' },
    { rule: 'CAN_CREATE', redirect: PATH.KEYS_VIEW },
  ],
  [PATH.MONITORING]: [{ rule: 'IS_NODE_OPERATOR' }],
  [PATH.GROUP]: [{ rule: 'IS_CM' }, { rule: 'IS_NODE_OPERATOR' }],

  [PATH.KEYS_SUBMIT]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.CREATE },
    { rule: 'HAS_MANAGER_ROLE', redirect: PATH.KEYS },
  ],
  [PATH.KEYS_REMOVE]: [{ rule: 'HAS_MANAGER_ROLE', redirect: PATH.KEYS_EXIT }],
  [PATH.KEYS_EJECT]: [{ rule: 'HAS_OWNER_ROLE', redirect: PATH.KEYS }],
  [PATH.KEYS_EXIT]: [{ rule: 'IS_NODE_OPERATOR', redirect: PATH.CREATE }],
  [PATH.KEYS_VIEW]: [{ rule: 'IS_NODE_OPERATOR' }],
  [PATH.KEYS_NORMALIZE]: [
    { rule: 'IS_NODE_OPERATOR' },
    { rule: 'IS_CSM', redirect: PATH.KEYS },
  ],

  [PATH.BOND_ADD]: [{ rule: 'IS_NODE_OPERATOR' }],
  [PATH.BOND_CLAIM]: [{ rule: 'IS_NODE_OPERATOR' }],
  [PATH.BOND_UNLOCK]: [{ rule: 'IS_NODE_OPERATOR' }],
  [PATH.BOND_REWARDS_HISTORY]: [{ rule: 'IS_NODE_OPERATOR' }],

  [PATH.SETTINGS_ROLES]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],
  [PATH.SETTINGS_REWARDS_ADDRESS]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],
  [PATH.SETTINGS_MANAGER_ADDRESS]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],
  [PATH.SETTINGS_CLAIMER]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],
  [PATH.SETTINGS_SPLITS]: [
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],
  [PATH.SETTINGS_INBOX]: [{ rule: 'IS_CONNECTED_WALLET' }],
  [PATH.SETTINGS_METADATA]: [
    { rule: 'IS_CM', redirect: PATH.SETTINGS },
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.SETTINGS_INBOX },
  ],

  [PATH.DELAYED_PENALTY]: [{ rule: 'EL_DELAYED_PENALTY_REPORTER' }],
  [PATH.DELAYED_PENALTY_REPORT]: [{ rule: 'EL_DELAYED_PENALTY_REPORTER' }],
  [PATH.DELAYED_PENALTY_CANCEL]: [{ rule: 'EL_DELAYED_PENALTY_REPORTER' }],

  // self-redirect on purpose: <Navigate> applies resolvePath(TYPE), whose
  // !ICS_APPLY_ENABLED branch never returns TYPE
  [PATH.TYPE]: [{ rule: 'ICS_APPLY_ENABLED', redirect: PATH.TYPE }],
  [PATH.TYPE_ICS_SYSTEM]: [{ rule: 'IS_CSM' }],
  [PATH.TYPE_ICS_APPLY]: [{ rule: 'IS_CSM' }, { rule: 'ICS_APPLY_ENABLED' }],
  [PATH.TYPE_ICS_PARAMETERS]: [
    { rule: 'IS_CSM' },
    { rule: 'ICS_APPLY_ENABLED', redirect: PATH.TYPE_PARAMETERS },
  ],
  // self-redirect on purpose: <Navigate> applies resolvePath(TYPE_ICS_CLAIM),
  // which never returns TYPE_ICS_CLAIM when IS_NODE_OPERATOR is false
  [PATH.TYPE_ICS_CLAIM]: [
    { rule: 'IS_CSM' },
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.TYPE_ICS_CLAIM },
  ],
  [PATH.TYPE_PARAMETERS]: [{ rule: 'IS_CSM' }],
  [PATH.TYPE_DVT_APPLY]: [{ rule: 'ICS_APPLY_ENABLED' }],
  [PATH.TYPE_DVT_PARAMETERS]: [
    { rule: 'IS_CSM' },
    { rule: 'ICS_APPLY_ENABLED', redirect: PATH.TYPE_PARAMETERS },
  ],
  // self-redirect on purpose: <Navigate> applies resolvePath(TYPE_DVT_CLAIM),
  // which never returns TYPE_DVT_CLAIM when IS_NODE_OPERATOR is false
  [PATH.TYPE_DVT_CLAIM]: [
    { rule: 'IS_CSM' },
    { rule: 'IS_NODE_OPERATOR', redirect: PATH.TYPE_DVT_CLAIM },
  ],

  [PATH.SURVEYS]: [{ rule: 'IS_SURVEYS_ACTIVE' }],

  [PATH.WRAPPED]: [
    { rule: 'IS_CSM' },
    { rule: 'IS_MAINNET' },
    { rule: 'IS_NODE_OPERATOR' },
  ],
};

// The single guard check, shared by PageGate (this page) and resolveTerminal
// (each hop). Guards run in order, as if nested: a still-loading rule defers
// (splash) and blocks the checks below it; the first failing rule wins its
// redirect (default PATH.HOME).
export const evalGuards = (
  guards: RouteGuard[],
  state: ShowFlagsState,
): GuardVerdict => {
  for (const { rule, redirect } of guards) {
    const allowed = state[rule];
    if (allowed === undefined) return { status: 'pending' };
    if (!allowed) return { status: 'redirect', to: redirect ?? PATH.HOME };
  }
  return { status: 'ok' };
};
