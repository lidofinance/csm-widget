import {
  CurveParameters,
  KeyNumberValueInterval,
  NodeOperatorInfo,
  QueueConfig,
} from '@lidofinance/lido-csm-sdk';

/**
 * Find the value from an interval configuration for a specific key index
 * @param keyIndex - 1-based key index
 * @param intervals - Array of key number value intervals
 * @returns The interval that contains the key index, or undefined if not found
 */
export const findValueInInterval = (
  keyIndex: number,
  intervals: KeyNumberValueInterval[],
): KeyNumberValueInterval | undefined => {
  return intervals.findLast(
    (interval) => keyIndex >= Number(interval.minKeyNumber),
  );
};

/**
 * Get bond amount for a specific key based on curve parameters
 * @param keyIndex - 1-based key index (relative to new keys being added)
 * @param bondConfig - Array of bond intervals from curve parameters
 * @param existingKeysCount - Number of keys the operator already has
 * @returns Bond amount in wei for the specified key
 */
export const getBondAmountForKey = (
  keyIndex: number,
  bondConfig: KeyNumberValueInterval[],
  existingKeysCount = 0,
): bigint => {
  const actualKeyIndex = existingKeysCount + keyIndex;
  const interval = findValueInInterval(actualKeyIndex, bondConfig);
  return interval?.value ?? 0n;
};

/**
 * Get fee percentage for a specific key based on curve parameters
 * @param keyIndex - 1-based key index (relative to new keys being added)
 * @param rewardsConfig - Array of reward intervals from curve parameters
 * @param existingKeysCount - Number of keys the operator already has
 * @returns Fee percentage in basis points (e.g., 600 for 6%)
 */
export const getFeeForKey = (
  keyIndex: number,
  rewardsConfig: KeyNumberValueInterval[],
  existingKeysCount = 0,
): bigint => {
  const actualKeyIndex = existingKeysCount + keyIndex;
  const interval = findValueInInterval(actualKeyIndex, rewardsConfig);
  return interval?.value ?? 0n;
};

/**
 * Get queue type for a specific key based on curve parameters
 * @param keyIndex - 1-based key index (relative to new keys being added)
 * @param queueConfig - Queue configuration from curve parameters
 * @param existingKeysCount - Number of keys the operator already has
 * @returns Queue type ("Priority" or "Basic")
 */
export const getQueueTypeForKey = (
  keyIndex: number,
  queueConfig: QueueConfig,
  existingKeysCount = 0,
): string => {
  if (!queueConfig || queueConfig.priority >= queueConfig.lowestPriority) {
    return 'Basic';
  }

  const actualKeyIndex = existingKeysCount + keyIndex;
  return actualKeyIndex <= queueConfig.maxDeposits ? 'Priority' : 'Basic';
};

export const canAddMorePriorityKeys = (
  { totalAddedKeys }: Pick<NodeOperatorInfo, 'totalAddedKeys'>,
  { queueConfig }: Pick<CurveParameters, 'queueConfig'>,
): boolean => {
  return totalAddedKeys < queueConfig.maxDeposits;
};
