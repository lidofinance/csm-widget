import { satanizer, commonPatterns } from '@lidofinance/satanizer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { clampArgs, MAX_TOTAL_CHARS, MAX_STRING_LENGTH } =
  require('../clamp-log-args.cjs') as {
    clampArgs: (args: unknown[]) => unknown[];
    MAX_TOTAL_CHARS: number;
    MAX_STRING_LENGTH: number;
  };

// Content only (strings + keys): structural chars are not what masking walks.
const charCount = (value: unknown): number => {
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + charCount(item), 0);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).reduce(
      (sum, [key, item]) => sum + key.length + charCount(item),
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

// Deliberately NOT derived from the module's own constants: raising a limit must fail this test.
const ABSOLUTE_STRING_CEILING = 4 * 1024;
const ABSOLUTE_TOTAL_CEILING = 32 * 1024;

const makeWideObject = (keys: number): Record<string, string> =>
  Object.fromEntries(
    Array.from({ length: keys }, (_, i) => [`key${i}`, `value${i}`]),
  );

describe('clampArgs', () => {
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
    expect(charCount(clamped)).toBeLessThan(ABSOLUTE_TOTAL_CEILING);
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

  // Without a visit budget, cycle detection releasing nodes on the way out
  // lets a shared subtree re-expand 64^6 times from seven real objects.
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
    expect(charCount(clamped)).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
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

  it('keeps an own `__proto__` key instead of reparenting the clamped object', () => {
    const parsed = JSON.parse('{"__proto__":{"polluted":1},"a":1}');
    const [clamped] = clampArgs([parsed]) as [Record<string, unknown>];

    expect(
      Object.getOwnPropertyDescriptor(clamped, '__proto__')?.value,
    ).toEqual({ polluted: 1 });
    expect(Object.getPrototypeOf(clamped)).toBe(Object.prototype);
  });

  it('keeps an own constructor string property on an Error', () => {
    const error = Object.assign(new Error('failed'), {
      constructor: 'x',
    });

    const [clamped] = clampArgs([error]) as [Record<string, unknown>];

    expect(clamped.constructor).toBe('x');
  });

  it('keeps masking cost bounded for an oversized payload', () => {
    const mask = satanizer(commonPatterns);
    const payload = [
      'x'.repeat(1024 * 1024),
      makeWideObject(20_000),
      ...Array.from({ length: 50 }, () => 'y'.repeat(64 * 1024)),
    ];
    const clamped = clampArgs(payload);

    // Masking cost is driven by the longest single string and by the total payload size.
    expect(MAX_STRING_LENGTH).toBeLessThanOrEqual(ABSOLUTE_STRING_CEILING);
    expect(MAX_TOTAL_CHARS).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
    expect(longestString(clamped)).toBeLessThanOrEqual(ABSOLUTE_STRING_CEILING);
    expect(charCount(clamped)).toBeLessThanOrEqual(ABSOLUTE_TOTAL_CEILING);
    expect(clamped[0]).toEqual(expect.stringContaining('truncated'));
    expect(() => mask(clamped)).not.toThrow();
  });
});
