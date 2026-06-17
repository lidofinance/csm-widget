// Walk an arbitrary error object across `.cause` and `.error` links (bounded
// depth) applying `predicate`. We do NOT rely on viem's `BaseError.walk`
// because wallet/vendor errors (Ledger, Safe) often reach us as plain objects
// outside a BaseError chain. This is the widget's vendor-detection job.
export const findInErrorTree = (
  error: unknown,
  predicate: (node: any) => boolean,
  depth = 0,
): unknown => {
  if (!error || typeof error !== 'object' || depth >= 4) return undefined;
  if (predicate(error)) return error;
  const node = error as Record<string, unknown>;
  return (
    findInErrorTree(node.cause, predicate, depth + 1) ??
    findInErrorTree(node.error, predicate, depth + 1)
  );
};

// Concatenate reason-bearing strings found in the error tree. Used only to
// recover Lido `require`-string reverts (e.g. STAKE_LIMIT) that carry no ABI
// selector and so are never in `decodedRevert`. Never used to classify wallet
// errors — that is the SDK's job via `error.code`.
export const extractReason = (error: unknown, depth = 0): string => {
  if (!error || typeof error !== 'object' || depth > 4) return '';
  const node = error as Record<string, unknown>;
  const parts: string[] = [];
  for (const field of ['reason', 'shortMessage', 'message', 'details']) {
    const value = node[field];
    if (typeof value === 'string') parts.push(value);
  }
  const nested = `${extractReason(node.cause, depth + 1)} ${extractReason(
    node.error,
    depth + 1,
  )}`.trim();
  return [...parts, nested].filter(Boolean).join(' ');
};
