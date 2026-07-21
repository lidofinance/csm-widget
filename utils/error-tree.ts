// Maximum traversal depth across `.cause` / `.error` links. Both
// `findInErrorTree` and `extractReason` use the same bound so the two
// functions make the same promise about how deep they look.
const MAX_DEPTH = 4;

// Walk an arbitrary error object across `.cause` and `.error` links (bounded
// depth) applying `predicate`. We do NOT rely on viem's `BaseError.walk`
// because wallet/vendor errors (Ledger, Safe) often reach us as plain objects
// outside a BaseError chain. This is the widget's vendor-detection job.
export const findInErrorTree = (
  error: unknown,
  predicate: (node: unknown) => boolean,
  depth = 0,
): unknown => {
  if (!error || typeof error !== 'object' || depth >= MAX_DEPTH)
    return undefined;
  if (predicate(error)) return error;
  const node = error as Record<string, unknown>;
  return (
    findInErrorTree(node.cause, predicate, depth + 1) ??
    findInErrorTree(node.error, predicate, depth + 1)
  );
};

// Collect reason-bearing strings found in the error tree, deduplicating via a
// Set to avoid repeating a reason that appears in both a node and its ancestor.
// Used only to recover Lido `require`-string reverts (e.g. STAKE_LIMIT) that
// carry no ABI selector and so are never in `decodedRevert`. Never used to
// classify wallet errors — that is the SDK's job via `error.code`.
const collectReasons = (
  error: unknown,
  depth: number,
  seen: Set<string>,
): void => {
  if (!error || typeof error !== 'object' || depth >= MAX_DEPTH) return;
  const node = error as Record<string, unknown>;
  for (const field of ['reason', 'shortMessage', 'message', 'details']) {
    const value = node[field];
    if (typeof value === 'string') seen.add(value);
  }
  collectReasons(node.cause, depth + 1, seen);
  collectReasons(node.error, depth + 1, seen);
};

export const extractReason = (error: unknown): string => {
  const seen = new Set<string>();
  collectReasons(error, 0, seen);
  return [...seen].filter(Boolean).join(' ');
};

// Ledger-live surfaces wallet rejections as `error.data[0].message`. This is
// the one error shape that hides a signal in an array element rather than along
// the `.cause`/`.error` chain, so it gets a small, bounded reader of its own
// (the first element only — that is where Ledger-live puts it).
export const extractDataMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  const data = (error as Record<string, unknown>).data;
  if (!Array.isArray(data)) return undefined;
  const first = data[0] as { message?: unknown } | undefined;
  return typeof first?.message === 'string' ? first.message : undefined;
};
