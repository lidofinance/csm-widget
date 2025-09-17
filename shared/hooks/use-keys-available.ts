import { useMemo } from 'react';
import {
  TOKENS,
  BondBalance,
  KeyNumberValueInterval,
} from '@lidofinance/lido-csm-sdk';
import { ONE_ETH } from 'consts/tokens';
import { KEYS_UPLOAD_TX_LIMIT } from 'consts';
import { useExchangeRate } from 'shared/hooks';
import { useCurveParameters } from 'modules/web3/hooks/use-curve-parameters';

type Props = {
  curveId?: bigint;
  bond?: BondBalance;
  nonWithdrawnKeys?: number;
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
};

export type KeysAvailable = Record<TOKENS, ReturnType<typeof calc>>;

export const useKeysAvailable = ({
  curveId,
  nonWithdrawnKeys,
  bond,
  ethBalance,
  stethBalance,
  wstethBalance,
}: Props) => {
  const { data: curve } = useCurveParameters(curveId);
  const { data: rates } = useExchangeRate();

  return useMemo(() => {
    if (!curve || !rates) {
      return undefined;
    }

    // Extract bond config from the parameters structure
    const bondConfig = curve.bondConfig;
    if (!bondConfig || bondConfig.length === 0) {
      return undefined;
    }

    return {
      [TOKENS.eth]: calc(
        ethBalance,
        rates[TOKENS.eth],
        bond?.current,
        KEYS_UPLOAD_TX_LIMIT,
        nonWithdrawnKeys,
        bondConfig,
      ),
      [TOKENS.steth]: calc(
        stethBalance,
        rates[TOKENS.steth],
        bond?.current,
        KEYS_UPLOAD_TX_LIMIT,
        nonWithdrawnKeys,
        bondConfig,
      ),
      [TOKENS.wsteth]: calc(
        wstethBalance,
        rates[TOKENS.wsteth],
        bond?.current,
        KEYS_UPLOAD_TX_LIMIT,
        nonWithdrawnKeys,
        bondConfig,
      ),
    } as KeysAvailable;
  }, [
    curve,
    rates,
    ethBalance,
    bond,
    nonWithdrawnKeys,
    stethBalance,
    wstethBalance,
  ]);
};

const calc = (
  balance?: bigint,
  rate?: bigint,
  bond = 0n,
  keysUploadLimit?: number,
  nonWithdrawnKeys = 0,
  bondConfig?: KeyNumberValueInterval[],
) => {
  if (keysUploadLimit === undefined || !bondConfig || !balance || !rate) return;

  const amountInSTETH = convert(balance, rate, ONE_ETH);
  const totalAmount = amountInSTETH + bond;

  const maxCount = getMaxKeys(bondConfig, totalAmount);

  const limitedMaxCount = Math.min(
    maxCount,
    nonWithdrawnKeys + keysUploadLimit,
  );

  const keysAmount = getAmountByKeys(bondConfig, limitedMaxCount) - bond;
  const count = Math.max(limitedMaxCount - nonWithdrawnKeys, 0);
  const amount = keysAmount > 0n ? convert(keysAmount, ONE_ETH, rate) : 0n;

  return {
    count,
    amount,
  };
};

const convert = (value: bigint, rate: bigint, base: bigint) => {
  return (value * rate) / base;
};

const getMaxKeys = (bondConfig: KeyNumberValueInterval[], amount: bigint) => {
  let currentAmount = 0n;
  let currentKeys = 0;

  for (let i = 0; i < bondConfig.length; i++) {
    const interval = bondConfig[i];
    const nextInterval = bondConfig[i + 1];

    // Determine the end of this interval
    const intervalEnd = nextInterval ? nextInterval.minKeyNumber : Infinity;

    // Calculate how many keys we can afford in this interval
    const remainingAmount = amount - currentAmount;
    const keysInInterval = Number(remainingAmount / interval.value);

    if (currentKeys + keysInInterval >= intervalEnd) {
      // Move to next interval
      const keysToAdd = intervalEnd - currentKeys;
      currentAmount += BigInt(keysToAdd) * interval.value;
      currentKeys = intervalEnd;

      if (currentAmount >= amount) {
        return currentKeys;
      }
    } else {
      // We can't afford to fill this interval completely
      return currentKeys + keysInInterval;
    }
  }

  return currentKeys;
};

const getAmountByKeys = (
  bondConfig: KeyNumberValueInterval[],
  count: number,
) => {
  let totalAmount = 0n;
  let currentKeys = 0;

  for (let i = 0; i < bondConfig.length && currentKeys < count; i++) {
    const interval = bondConfig[i];
    const nextInterval = bondConfig[i + 1];

    // Determine the end of this interval
    const intervalEnd = nextInterval ? nextInterval.minKeyNumber : count;

    // Calculate how many keys to process in this interval
    const keysInThisInterval = Math.min(
      count - currentKeys,
      intervalEnd - currentKeys,
    );

    // Add the cost for these keys
    totalAmount += BigInt(keysInThisInterval) * interval.value;
    currentKeys += keysInThisInterval;
  }

  return totalAmount;
};
