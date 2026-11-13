import {
  KEY_STATUS,
  type BondBalance,
  type KeyWithStatus,
} from '@lidofinance/lido-csm-sdk';
import type { Hex } from 'viem';

export const REMOVE_KEYS_FORM_TEST_ID = 'removeKeysForm';

export const REMOVAL_FEE_TOOLTIP =
  "Key deletion incurs a removal charge, deducted from the Node Operator's bond. This charge covers the maximum possible operational costs of queue processing.";

export const NO_KEYS_TO_REMOVE = 'No keys available to remove';

export const NO_KEYS_TO_REMOVE_NOTE =
  'Note: Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL).';

export const SEQUENTIAL_HINT = 'Your choice has to be a sequential array';

export const REMOVE_KEY_TAG_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.UNBONDED,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
];

export const getRemoveKeyTags = ({
  statuses,
}: Pick<KeyWithStatus, 'statuses'>): KEY_STATUS[] =>
  statuses.filter((status) => REMOVE_KEY_TAG_STATUSES.includes(status));

export const showSequentialHint = (keysCount: number) => keysCount > 2;

export const getRemovalFeeTotal = (
  removalFee: bigint | undefined,
  count: number,
): bigint | undefined =>
  removalFee !== undefined ? removalFee * BigInt(count) : undefined;

export type RemoveKeysArgs = {
  startIndex: bigint;
  keysCount: bigint;
  pubkeys: Hex[];
};

// Positions in the filtered list map to on-chain indices after the deposited keys (pre-existing FIXME)
export const getRemoveKeysArgs = (
  keys: Pick<KeyWithStatus, 'pubkey'>[],
  totalDepositedKeys: number,
  { start, count }: { start: number; count: number },
): RemoveKeysArgs => ({
  startIndex: BigInt(totalDepositedKeys + start),
  keysCount: BigInt(count),
  pubkeys: keys.map(({ pubkey }) => pubkey).slice(start, start + count),
});

export type BondAfterRemovalInput = {
  totalAddedKeys: number;
  totalWithdrawnKeys: number;
  bondCurrent: bigint;
  removalFee: bigint;
  count: number;
};

export const getBondAfterRemoval = ({
  totalAddedKeys,
  totalWithdrawnKeys,
  bondCurrent,
  removalFee,
  count,
}: BondAfterRemovalInput) => ({
  nextKeysCount: totalAddedKeys - totalWithdrawnKeys - count,
  bondAfter: bondCurrent - removalFee * BigInt(count),
});

export type BondAfterRow = {
  label: string;
  insufficient: boolean;
  amount?: bigint;
};

export const getBondAfterRow = (
  balance?: Pick<BondBalance, 'delta' | 'isInsufficient'>,
): BondAfterRow => {
  const insufficient = Boolean(balance?.isInsufficient);

  return {
    label: `${insufficient ? 'Insufficient' : 'Excess'} bond after execution`,
    insufficient,
    amount: balance?.delta,
  };
};
