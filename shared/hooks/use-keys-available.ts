import { useMemo } from 'react';
import { BondBalance, CurveRef, TOKENS } from '@lidofinance/lido-csm-sdk';
import { KEYS_UPLOAD_TX_LIMIT, ONE_ETH } from 'consts';
import { useExchangeRate } from 'shared/hooks';
import { useCurveParameters } from 'modules/web3/hooks/use-curve-parameters';
import { bondForKeys, convert, maxKeysForBond } from 'utils';

type Props = {
  curve?: CurveRef;
  bond?: BondBalance;
  nonWithdrawnKeys?: number;
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
};

type AvailableForToken = { count: number; amount: bigint };
export type KeysAvailable = Record<TOKENS, AvailableForToken>;

/**
 * How many keys the wallet balances can fund, per token, with the bond amount
 * each option would cost. Capped by the per-transaction upload limit and the
 * curve's `keysLimit` (max non-withdrawn keys). Informational only — the
 * actual key count comes from the uploaded deposit data. The curve math is
 * reconstructed client-side from `bondConfig` (see `utils/bond-curve`); no
 * extra on-chain reads.
 */
export const useKeysAvailable = ({
  curve,
  bond,
  nonWithdrawnKeys = 0,
  ethBalance,
  stethBalance,
  wstethBalance,
}: Props): KeysAvailable | undefined => {
  const { data: curveParameters } = useCurveParameters(curve);
  const { data: rates } = useExchangeRate();

  return useMemo(() => {
    const intervals = curveParameters?.bondConfig;
    const keysLimit = curveParameters?.keysLimit;
    if (
      !intervals ||
      intervals.length === 0 ||
      keysLimit === undefined ||
      !rates
    ) {
      return undefined;
    }

    const currentBond = bond?.current ?? 0n;

    const calc = (
      balance: bigint | undefined,
      rate: bigint,
    ): AvailableForToken => {
      if (balance === undefined) return { count: 0, amount: 0n };

      const balanceInSteth = convert(balance, rate);
      const fundable = maxKeysForBond(intervals, currentBond + balanceInSteth);
      const limited = Math.min(
        fundable,
        nonWithdrawnKeys + KEYS_UPLOAD_TX_LIMIT,
        keysLimit,
      );

      const count = Math.max(limited - nonWithdrawnKeys, 0);
      const neededSteth = bondForKeys(intervals, limited) - currentBond;
      const amount =
        neededSteth > 0n ? convert(neededSteth, ONE_ETH, rate) : 0n;

      return { count, amount };
    };

    return {
      [TOKENS.eth]: calc(ethBalance, rates[TOKENS.eth]),
      [TOKENS.steth]: calc(stethBalance, rates[TOKENS.steth]),
      [TOKENS.wsteth]: calc(wstethBalance, rates[TOKENS.wsteth]),
    } as KeysAvailable;
  }, [
    curveParameters,
    rates,
    bond,
    nonWithdrawnKeys,
    ethBalance,
    stethBalance,
    wstethBalance,
  ]);
};
