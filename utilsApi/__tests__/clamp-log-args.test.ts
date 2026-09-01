import { satanizer, commonPatterns } from '@lidofinance/satanizer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clampArgs, MAX_TOTAL_CHARS, MAX_STRING_LENGTH } =
  require('../clamp-log-args.cjs') as {
    clampArgs: (args: unknown[]) => unknown[];
    MAX_TOTAL_CHARS: number;
    MAX_STRING_LENGTH: number;
  };

const countChars = (value: unknown): number => {
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value))
    return value.reduce((sum, item) => sum + countChars(item), 0);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).reduce(
      (sum, [key, item]) => sum + key.length + countChars(item),
      0,
    );
  }
  return 0;
};

const longestString = (value: unknown): number => {
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) {
    return value.reduce((max, item) => Math.max(max, longestString(item)), 0);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).reduce(
      (max, [key, item]) => Math.max(max, key.length, longestString(item)),
      0,
    );
  }
  return 0;
};

// Slack over the budget: each clamped string may add a "[truncated N chars]" suffix, and keys are counted too.
const BUDGET_CEILING = MAX_TOTAL_CHARS * 2;

// Absolute ceilings, deliberately NOT derived from the module's own constants: masking cost grows quickly with string length, so raising a limit must fail this test and force a conscious decision rather than silently widening it.
const ABSOLUTE_STRING_CEILING = 4 * 1024;
const ABSOLUTE_TOTAL_CEILING = 32 * 1024;

const makeWideObject = (keys: number): Record<string, string> =>
  Object.fromEntries(
    Array.from({ length: keys }, (_, i) => [`key${i}`, `value${i}`]),
  );

describe('clampArgs', () => {
  it('bounds a single oversized string', () => {
    const huge = 'x'.repeat(1024 * 1024);
    const [clamped] = clampArgs([huge]);

    expect(countChars(clamped)).toBeLessThan(BUDGET_CEILING);
    expect(clamped).toEqual(expect.stringContaining('truncated'));
  });

  it('bounds an object with many keys', () => {
    const wide = makeWideObject(20_000);
    const [clamped] = clampArgs([wide]);

    expect(countChars(clamped)).toBeLessThan(BUDGET_CEILING);
  });

  it('bounds many oversized strings across one log line', () => {
    const args = Array.from({ length: 50 }, () => 'y'.repeat(64 * 1024));
    const clamped = clampArgs(args);

    expect(countChars(clamped)).toBeLessThan(BUDGET_CEILING);
  });

  it('keeps short payloads byte-identical', () => {
    const payload = [
      { type: 'CSP Violation', violation: { 'document-uri': '/x' } },
    ];

    expect(clampArgs(payload)).toEqual(payload);
  });

  it('flattens an Error and clamps its message', () => {
    const error = new Error('x'.repeat(64 * 1024), {
      cause: new Error('root'),
    });
    const [clamped] = clampArgs([error]) as [
      { name: string; message: string; cause: { message: string } },
    ];

    expect(clamped.name).toBe('Error');
    expect(clamped.message).toEqual(expect.stringContaining('truncated'));
    expect(countChars(clamped)).toBeLessThan(BUDGET_CEILING);
    expect(clamped.cause).toMatchObject({ message: 'root' });
  });

  it('survives cycles, deep nesting and throwing getters', () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    Object.defineProperty(cyclic, 'poison', {
      enumerable: true,
      get() {
        throw new Error('boom');
      },
    });

    let deep: Record<string, unknown> = {};
    const root = deep;
    for (let i = 0; i < 100; i++) {
      const next: Record<string, unknown> = {};
      deep.next = next;
      deep = next;
    }

    expect(() => clampArgs([cyclic, root])).not.toThrow();
  });

  it('does not report a repeated object as a cycle', () => {
    const shared = { value: 'shared' };
    const [clamped] = clampArgs([{ a: shared, b: shared }]) as [
      { a: unknown; b: unknown },
    ];

    expect(clamped.a).toEqual({ value: 'shared' });
    expect(clamped.b).toEqual({ value: 'shared' });
  });

  // A shared subtree is reachable by many paths. Cycle detection releases the
  // node on the way out, so without a visit budget this expands 64^6 times from
  // seven real objects and never returns.
  it('bounds a shared subtree reachable by many paths', () => {
    let node: Record<string, unknown> = { leaf: 'x' };
    for (let depth = 0; depth < 6; depth++) {
      const parent: Record<string, unknown> = {};
      for (let key = 0; key < 64; key++) parent[`k${key}`] = node;
      node = parent;
    }

    const started = Date.now();
    const clamped = clampArgs([node]);

    expect(Date.now() - started).toBeLessThan(1000);
    expect(countChars(clamped)).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
  });

  it('keeps an error’s diagnostic own properties', () => {
    const error = Object.assign(new Error('failed'), {
      code: 'ECONNRESET',
      status: 503,
      shortMessage: 'HTTP request failed',
    });

    const [clamped] = clampArgs([error]) as [Record<string, unknown>];

    expect(clamped).toMatchObject({
      name: 'Error',
      message: 'failed',
      code: 'ECONNRESET',
      status: 503,
      shortMessage: 'HTTP request failed',
    });
  });

  it('keeps non-enumerable own properties', () => {
    const errorLike = Object.create(Error.prototype);
    Object.defineProperty(errorLike, 'message', {
      value: 'hidden',
      enumerable: false,
    });

    const [clamped] = clampArgs([errorLike]) as [Record<string, unknown>];

    expect(clamped.message).toBe('hidden');
  });

  it('keeps masking cost bounded for an oversized payload', () => {
    const mask = satanizer(commonPatterns);
    const payload = ['x'.repeat(1024 * 1024), makeWideObject(20_000)];
    const clamped = clampArgs(payload);

    // Masking cost is driven by the longest single string and by the total payload size, so assert both directly instead of wall-clock time.
    expect(MAX_STRING_LENGTH).toBeLessThanOrEqual(ABSOLUTE_STRING_CEILING);
    expect(MAX_TOTAL_CHARS).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
    expect(longestString(clamped)).toBeLessThanOrEqual(ABSOLUTE_STRING_CEILING);
    expect(countChars(clamped)).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
    expect(() => mask(clamped)).not.toThrow();
  });
});
