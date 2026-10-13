// Caps log arguments before satanizer masking; masking cost grows faster than linearly with payload size.
// .cjs: next-logger preloads this without a build step and the project is "type":"module".
// pino's depthLimit/edgeLimit run after masking, so they don't bound masking cost.

// Sized above the longest real strings this app logs (CSP original-policy ~700, viem stack ~800).
const MAX_STRING_LENGTH = 2 * 1024;
const MAX_TOTAL_CHARS = 16 * 1024;
const MAX_OBJECT_KEYS = 64;
const MAX_ARRAY_ITEMS = 64;
const MAX_DEPTH = 6;
// A shared subtree is re-expanded once per path that reaches it, so depth/key
// caps alone don't bound traversal — 64 keys at depth 6 is ~7e10 visits.
const MAX_NODES = 2 * 1024;

// One character on purpose — it can appear once per visited node, so a verbose
// marker would reintroduce an unbounded line.
const EXHAUSTED = '…';

// `target.__proto__ = v` hits the inherited setter; JSON.parse can produce it as an own key.
const setOwn = (target, key, value) => {
  if (key === '__proto__') {
    Object.defineProperty(target, key, {
      value,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  } else {
    target[key] = value;
  }
};

const clampArgs = (args) => {
  const budget = { chars: MAX_TOTAL_CHARS, nodes: MAX_NODES };

  const clampString = (value) => {
    if (budget.chars <= 0) return EXHAUSTED;

    const limit = Math.min(MAX_STRING_LENGTH, budget.chars);

    if (value.length <= limit) {
      budget.chars -= value.length;
      return value;
    }

    budget.chars -= limit;

    return `${value.slice(0, limit)}…[truncated ${value.length - limit} chars]`;
  };

  const clamp = (value, depth, seen) => {
    if (budget.nodes <= 0) return EXHAUSTED;
    budget.nodes--;

    if (typeof value === 'string') return clampString(value);
    if (value === null || typeof value !== 'object') return value;
    if (seen.has(value)) return '[Circular]';
    if (depth >= MAX_DEPTH) return '[MaxDepth]';

    seen.add(value);

    try {
      if (Array.isArray(value)) {
        const items = value
          .slice(0, MAX_ARRAY_ITEMS)
          .map((item) => clamp(item, depth + 1, seen));

        if (value.length > MAX_ARRAY_ITEMS) {
          items.push(`[truncated ${value.length - MAX_ARRAY_ITEMS} items]`);
        }

        return items;
      }

      // Own names, not keys: message/stack on a hand-rolled error are
      // non-enumerable. Error.name is inherited, so add it.
      const names = Object.getOwnPropertyNames(value);
      const keys =
        value instanceof Error && !names.includes('name')
          ? ['name', ...names]
          : names;
      const clamped = {};

      for (const key of keys.slice(0, MAX_OBJECT_KEYS)) {
        setOwn(clamped, clampString(key), clamp(value[key], depth + 1, seen));
      }

      if (keys.length > MAX_OBJECT_KEYS) {
        clamped['[truncated]'] = `${keys.length - MAX_OBJECT_KEYS} more keys`;
      }

      return clamped;
    } catch {
      // A throwing getter must never break logging.
      return '[unserializable]';
    } finally {
      // Drop on the way out so a repeated object isn't misreported as a cycle.
      seen.delete(value);
    }
  };

  return args.map((arg) => clamp(arg, 0, new Set()));
};

module.exports = {
  clampArgs,
  MAX_STRING_LENGTH,
  MAX_TOTAL_CHARS,
};
