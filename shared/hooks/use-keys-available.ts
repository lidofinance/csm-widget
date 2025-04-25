import { Zero } from '@ethersproject/constants';
import { ONE_ETH, TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { ICSBondCurve } from 'generated/CSAccounting';
import { useExchangeTokensRate, useMergeSwr } from 'shared/hooks';
import { BondBalance } from 'types';
import { useCurveInfo } from './useCurveInfo';
import { KEYS_UPLOAD_TX_LIMIT } from 'consts';

type Props = {
  curveId?: BigNumber;
  bond?: BondBalance;
  nonWithdrawnKeys?: number;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
};

export type KeysAvailable = Record<TOKENS, ReturnType<typeof calc>>;

export const useKeysAvailable = ({
  curveId,
  nonWithdrawnKeys,
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
      KEYS_UPLOAD_TX_LIMIT,
      nonWithdrawnKeys,
      swrCurve.data,
    ),
    [TOKENS.STETH]: calc(
      stethBalance,
      swrRates.data?.STETH,
      bond?.current,
      KEYS_UPLOAD_TX_LIMIT,
      nonWithdrawnKeys,
      swrCurve.data,
    ),
    [TOKENS.WSTETH]: calc(
      wstethBalance,
      swrRates.data?.WSTETH,
      bond?.current,
      KEYS_UPLOAD_TX_LIMIT,
      nonWithdrawnKeys,
      swrCurve.data,
    ),
  } as KeysAvailable);
};

const calc = (
  balance?: BigNumber,
  rate?: BigNumber,
  bond: BigNumber = Zero,
  keysUploadLimit?: number,
  nonWithdrawnKeys = 0,
  curve?: ICSBondCurve.BondCurveStruct,
) => {
  if (keysUploadLimit === undefined || !curve || !balance || !rate) return;

  const amountInSTETH = convert(balance, rate, ONE_ETH);
  const totalAmount = amountInSTETH.add(bond);

  const maxCount = getMaxKeys(curve, totalAmount);

  const limitedMaxCount = Math.min(
    maxCount,
    nonWithdrawnKeys + keysUploadLimit,
  );

  const keysAmount = getAmountByKeys(curve, limitedMaxCount).sub(bond);
  const count = Math.max(limitedMaxCount - nonWithdrawnKeys, 0);
  const amount = keysAmount.gt(0) ? convert(keysAmount, ONE_ETH, rate) : Zero;

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
    return curve.points.findIndex((p) => amount.lt(p));
  }
  return amount
    .sub(curve.points[curve.points.length - 1])
    .div(curve.trend)
    .add(curve.points.length)
    .toNumber();
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
