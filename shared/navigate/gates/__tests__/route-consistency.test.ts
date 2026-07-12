import { PATH } from 'consts/urls';
import type { ShowRule } from 'shared/hooks';
import { evalGuards, ROUTE_GUARDS } from '../route-guards';
import { ROUTE_RESOLUTION, resolvePath } from '../route-resolution';
import { resolveTerminal } from '../route-terminal';
import { buildStates, simulateLoad, STUB_PATHS, trueFlags } from './test-helpers';

const STATES = buildStates();
const PATHS = Object.values(PATH);

describe('route guards + route resolution consistency', () => {
  it('should resolve every path to an accessible, non-stub page', () => {
    const violations: string[] = [];
    for (const flags of STATES) {
      for (const path of PATHS) {
        const t = resolveTerminal(path, flags);
        if (t.status !== 'ready') {
          violations.push(`${path} not ready [${trueFlags(flags)}]`);
        } else if (
          evalGuards(ROUTE_GUARDS[t.path] ?? [], flags).status !== 'ok'
        ) {
          violations.push(`${path} -> blocked ${t.path} [${trueFlags(flags)}]`);
        } else if (STUB_PATHS.includes(t.path)) {
          violations.push(`${path} -> stub ${t.path} [${trueFlags(flags)}]`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('should never loop (every direct load settles)', () => {
    const violations: string[] = [];
    for (const flags of STATES) {
      for (const path of PATHS) {
        if (simulateLoad(path, flags).looped) {
          violations.push(`${path} [${trueFlags(flags)}]`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // resolveTerminal reads flags through the resolve fns; a fn reading an
  // undeclared flag would resolve on a possibly-still-loading value, so deps
  // drift must be impossible.
  it('should declare every flag a resolution rule reads in its deps', () => {
    const violations = new Set<string>();
    for (const [path, entry] of Object.entries(ROUTE_RESOLUTION)) {
      for (const flags of STATES) {
        const reads = new Set<string>();
        const tracked = new Proxy(flags, {
          get: (target, prop) => {
            if (typeof prop === 'string') reads.add(prop);
            return target[prop as ShowRule];
          },
        });
        entry.resolve(tracked);
        for (const read of reads) {
          if (!entry.deps.includes(read as ShowRule)) {
            violations.add(`${path} reads ${read} (missing from deps)`);
          }
        }
      }
    }
    expect([...violations].sort()).toEqual([]);
  });

  // Stub pages forward via resolvePath — a resolution returning the stub path
  // itself would self-push forever.
  it('should resolve every stub path away from itself', () => {
    const violations: string[] = [];
    for (const path of STUB_PATHS) {
      for (const flags of STATES) {
        if (resolvePath(path, flags) === path) {
          violations.push(`${path} [${trueFlags(flags)}]`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // Licenses resolveTerminal skipping a stub check: since resolvePath runs every
  // hop and never yields a stub, `current` can never rest on one.
  it('should never resolve to a stub path', () => {
    const violations: string[] = [];
    for (const flags of STATES) {
      for (const path of PATHS) {
        const resolved = resolvePath(path, flags);
        if (STUB_PATHS.includes(resolved)) {
          violations.push(`${path} -> ${resolved} [${trueFlags(flags)}]`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  // Documents today's real contradictions between in-app navigation (which
  // corrects toward the terminal) and direct URL entry (guards run on the raw
  // path). Intentional snapshot: a change here means the navigate/direct gap
  // moved — review it, don't just update blindly.
  it('should document navigate-vs-direct terminal divergences', () => {
    const divergences = new Set<string>();
    for (const flags of STATES) {
      for (const path of PATHS) {
        const nav = resolveTerminal(path, flags); // in-app navigation
        const dir = simulateLoad(path, flags); // direct URL entry
        if (nav.status === 'ready' && !dir.looped && nav.path !== dir.terminal) {
          divergences.add(
            `${path}: navigate->${nav.path} direct->${dir.terminal}`,
          );
        }
      }
    }
    expect([...divergences].sort()).toMatchSnapshot();
  });
});
