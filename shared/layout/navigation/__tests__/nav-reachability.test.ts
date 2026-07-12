import type { ShowFlags } from 'shared/hooks';
// direct import (not the shared/hooks barrel) keeps the SDK graph out of jest
import { evaluateShowRules } from 'utils/evaluate-show-rules';
import { resolveTerminal } from 'shared/navigate/gates/route-terminal';
import {
  buildStates,
  simulateLoad,
  trueFlags,
} from 'shared/navigate/gates/__tests__/test-helpers';
import { NAV_ROUTES, NavRoute } from '../nav-routes';

// nav-routes.ts bundles presentation imports jest cannot load (the SDK barrel
// pulls ESM ipfs/ssz deps; counters pull the SDK; lido-ui ships icons) — stub
// them, the test reads only route data. Svg assets are mapped in jest.config
jest.mock('@lidofinance/lido-csm-sdk', () => ({
  MODULE_NAME: { CSM: 'CSM', CM: 'CM' },
}));
jest.mock('@lidofinance/lido-ui', () => ({
  Eth: () => null,
  Plus: () => null,
}));
jest.mock('shared/counters', () => ({
  CounterClaimType: () => null,
  CounterInvalidKeys: () => null,
  CounterInvites: () => null,
  CounterLockedBond: () => null,
  CounterSurveys: () => null,
}));

// Mirrors useFilterShowRules (shared/hooks/use-show-rule.ts): a route is
// visible when its module matches config.module (the uppercased MODULE env,
// same values as MODULE_NAME: 'CSM' | 'CM') and its showRules pass as an
// OR-of-ANDs over the show flags.
const isVisible = (route: NavRoute, flags: ShowFlags): boolean => {
  const moduleName = flags.IS_CSM ? 'CSM' : 'CM';
  if (route.module && (route.module as string) !== moduleName) return false;
  return evaluateShowRules(route.showRules, (rule) => flags[rule]);
};

const STATES = buildStates();

describe('nav visibility vs routing reachability', () => {
  it('should never loop when navigating to a visible nav item', () => {
    const violations: string[] = [];
    for (const flags of STATES) {
      for (const route of NAV_ROUTES) {
        if (!isVisible(route, flags)) continue;
        if (simulateLoad(route.path, flags).looped) {
          violations.push(
            `${route.name} (${route.path}) [${trueFlags(flags)}]`,
          );
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // Documents nav links whose destination leaves the link's own section —
  // known asymmetries between nav visibility (showRules) and routing
  // (guards + resolution). A clicked nav link now navigates to its collapsed
  // terminal (resolveTerminal), same as its href. Intentional snapshot: review
  // changes, don't update blindly.
  it('should document visible nav items that land outside their own section', () => {
    const escapes = new Set<string>();
    for (const flags of STATES) {
      for (const route of NAV_ROUTES) {
        if (!isVisible(route, flags)) continue;
        const target = resolveTerminal(route.path, flags);
        if (
          target.status === 'ready' &&
          target.path !== route.path &&
          !(route.subPaths ?? []).includes(target.path)
        ) {
          escapes.add(`${route.name} (${route.path}): lands ${target.path}`);
        }
      }
    }
    expect([...escapes].sort()).toMatchSnapshot();
  });
});
