export const SYMBOL_SELECTOR = '0x95d89b41';

export const rpcCall = (method: unknown, params: unknown[] = [], id = 1) => ({
  jsonrpc: '2.0',
  id,
  method,
  params,
});

/** eth_call of `symbol()` on `to`, with a state override if given */
export const symbolCall = (to: string, stateOverride?: object) =>
  rpcCall('eth_call', [
    { to, data: SYMBOL_SELECTOR },
    'latest',
    ...(stateOverride ? [stateOverride] : []),
  ]);

/** State override of one storage slot of `address` */
export const slotOverride = (
  address: string,
  slot = `0x${'11'.repeat(32)}`,
) => ({
  [address]: { stateDiff: { [slot]: `0x${'0'.repeat(63)}1` } },
});
