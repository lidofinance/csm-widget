/**
 * Comma-separated URLs: trimmed, trailing slashes stripped (they break some
 * RPC/CL providers, e.g. Infura), empties dropped.
 * @param {string | undefined} value
 * @returns {string[]}
 */
export const parseUrlList = (value) =>
  value
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];
