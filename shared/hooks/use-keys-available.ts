import { ONE_ETH, TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { ICSBondCurve } from 'generated/CSAccounting';
import { useExchangeTokensRate, useMergeSwr } from 'shared/hooks';
import { BondBalance } from 'types';
import { useCurveInfo } from './useCurveInfo';
import { Zero } from '@ethersproject/constants';

type Props = {
  curveId?: BigNumber;
  bond?: BondBalance;
  keysCountLimit?: number;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
};

export type KeysAvailable = Record<TOKENS, ReturnType<typeof calc>>;

export const useKeysAvailable = ({
  curveId,
  keysCountLimit,
  bond,
  etherBalance,
  stethBalance,
  wstethBalance,
}: Props) => {
  const swrCurve = useCurveInfo(curveId);

  const swrRates = useExchangeTokensRate();

  return useMergeSwr([swrCurve, swrRates], {
    [TOKENS.ETH]: calc(
      etherBalance,
      swrRates.data?.ETH,
      bond?.current,
      keysCountLimit,
      swrCurve.data,
    ),
    [TOKENS.STETH]: calc(
      stethBalance,
      swrRates.data?.STETH,
      bond?.current,
      keysCountLimit,
      swrCurve.data,
    ),
    [TOKENS.WSTETH]: calc(
      wstethBalance,
      swrRates.data?.WSTETH,
      bond?.current,
      keysCountLimit,
      swrCurve.data,
    ),
  } as KeysAvailable);
};

const calc = (
  balance?: BigNumber,
  rate?: BigNumber,
  bond: BigNumber = Zero,
  keysCountLimit?: number,
  curve?: ICSBondCurve.BondCurveStruct,
) => {
  if (keysCountLimit === undefined || !curve || !balance || !rate) return;

  const totalAmount = convert(balance, rate, ONE_ETH).add(bond);

  const maxCount = getMaxKeys(curve, totalAmount);

  const count = maxCount.lt(keysCountLimit)
    ? maxCount.toNumber()
    : keysCountLimit;
  const keysAmount = getAmountByKeys(curve, count);

  const amount = keysAmount.gt(0)
    ? convert(keysAmount.sub(bond), ONE_ETH, rate)
    : keysAmount;

  return {
    count,
    amount,
  };
};

const convert = (value: BigNumber, rate: BigNumber, base: BigNumber) => {
  return value.mul(rate).div(base);
};

const getMaxKeys = (curve: ICSBondCurve.BondCurveStruct, amount: BigNumber) => {
  if (amount.lte(curve.points[curve.points.length - 1])) {
    return BigNumber.from(curve.points.findIndex((p) => amount.lt(p)));
  }
  return amount
    .sub(curve.points[curve.points.length - 1])
    .div(curve.trend)
    .add(curve.points.length);
};

const getAmountByKeys = (
  curve: ICSBondCurve.BondCurveStruct,
  count: number,
) => {
  if (curve.points.length >= count) {
    return BigNumber.from(curve.points[count - 1] ?? 0);
  }
  return BigNumber.from(curve.trend)
    .mul(count - curve.points.length)
    .add(curve.points[curve.points.length - 1]);
};
