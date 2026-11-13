import type {
  KeyWithStatus,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';
import { maxUint128 } from 'viem';
import { selectKeysBreakdown } from 'utils/keys-breakdown';

export type KeysStats = {
  activeKeys: number;
  totalKeys: number;
  keysLimit: number | undefined;
  activeBalance: bigint;
};

type SelectKeysStatsInput = {
  info: Pick<
    NodeOperatorInfo,
    'totalAddedKeys' | 'totalDepositedKeys' | 'totalWithdrawnKeys'
  >;
  keys: KeyWithStatus[] | undefined;
  keysLimit: number | undefined;
};

export const selectKeysStats = ({
  info,
  keys,
  keysLimit,
}: SelectKeysStatsInput): KeysStats => ({
  activeKeys: info.totalDepositedKeys - info.totalWithdrawnKeys,
  totalKeys: info.totalAddedKeys - info.totalWithdrawnKeys,
  keysLimit:
    keysLimit === undefined || keysLimit >= maxUint128 ? undefined : keysLimit,
  activeBalance: keys ? selectKeysBreakdown(keys).balances.active : 0n,
});
