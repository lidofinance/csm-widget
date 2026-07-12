import { PATH } from 'consts/urls';
import type { ShowFlagsState } from 'shared/hooks';
import { resolveNavigable, resolveTerminal } from '../route-terminal';
import { buildStates, makeFlags, simulateLoad, trueFlags } from './test-helpers';

const STATES = buildStates();
const PATHS = Object.values(PATH);

describe('page-load redirects — real browser push count', () => {
  it('should push at most once loading any page in any reachable state', () => {
    const tooMany: string[] = [];
    for (const flags of STATES) {
      for (const entry of PATHS) {
        const { pushes } = simulateLoad(entry, flags);
        if (pushes > 1) {
          tooMany.push(`${entry}: ${pushes} pushes [${trueFlags(flags)}]`);
        }
      }
    }
    expect(tooMany).toEqual([]);
  });

  it('should make one push, landing on home, for the create -> keys -> home fallback', () => {
    // connected, cannot create, not an operator: /create's CAN_CREATE guard
    // aims at /keys/view, whose IS_NODE_OPERATOR guard then aims at /home
    const flags = makeFlags({
      IS_CSM: true,
      IS_CONNECTED_WALLET: true,
      NOT_NODE_OPERATOR: true,
    });
    expect(simulateLoad(PATH.CREATE, flags)).toMatchObject({
      terminal: PATH.HOME,
      pushes: 1,
    });
  });

  it('should not push while a guard flag on the chain is still loading', () => {
    // /create redirects toward /keys/view, whose IS_NODE_OPERATOR guard has not
    // loaded yet: the browser holds the splash on /create, pushing nothing
    const state: ShowFlagsState = {
      ...makeFlags({ IS_CSM: true, IS_CONNECTED_WALLET: true }),
      IS_NODE_OPERATOR: undefined,
      NOT_NODE_OPERATOR: undefined,
    };
    expect(simulateLoad(PATH.CREATE, state).pushes).toBe(0);
    expect(resolveTerminal(PATH.KEYS_VIEW, state)).toEqual({ status: 'pending' });
  });
});

describe('resolveNavigable — hrefs & imperative navigation', () => {
  const loaded = makeFlags({
    IS_CSM: true,
    IS_CONNECTED_WALLET: true,
    NOT_NODE_OPERATOR: true,
  });

  it('should collapse to the terminal once flags are loaded', () => {
    // /create is inaccessible here, so an imperative nav to it lands on /home
    expect(resolveNavigable(PATH.CREATE, loaded)).toBe(PATH.HOME);
    expect(resolveNavigable(PATH.CREATE, loaded)).toBe(
      resolveTerminal(PATH.CREATE, loaded).status === 'ready'
        ? PATH.HOME
        : PATH.CREATE,
    );
  });

  it('should fall back to a single resolution step while the chain loads', () => {
    // terminal is pending (IS_NODE_OPERATOR loading) → single step keeps the raw
    // page, and its PageGate then validates on live flags
    const state: ShowFlagsState = {
      ...loaded,
      IS_NODE_OPERATOR: undefined,
      NOT_NODE_OPERATOR: undefined,
    };
    expect(resolveNavigable(PATH.KEYS_VIEW, state)).toBe(PATH.KEYS_VIEW);
  });
});
