// interval in ms for RPC event polling for token balance and tx updates
export const PROVIDER_POLLING_INTERVAL = 12_000;
// how long in ms to wait for RPC batching(multicall and provider)
export const PROVIDER_BATCH_TIME = 150;
// max batch
export const PROVIDER_MAX_BATCH = 20;
// AA transaction polling timeout(ms)
export const AA_TX_POLLING_TIMEOUT = 180_000; // 3 minutes

export const MAX_BLOCK_RANGE_FOR_EVENTS = 1_000_000;
