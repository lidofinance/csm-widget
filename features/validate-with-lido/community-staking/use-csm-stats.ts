import {
  MAX_EFFECTIVE_BALANCE,
  MIN_EFFECTIVE_BALANCE,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { useMemo } from 'react';
import { formatEther } from 'viem';
import {
  useCurveParameters,
  useOperatorsCount,
  useStethSmaApr,
} from 'modules/web3';
import { useOperatorTypeCurve } from 'shared/hooks';
import { bigMax, bigMin } from 'utils/bigint-utils';
import { calcMaxApr } from 'utils/csm-max-apr';

export type Stat<T> = { value?: T; isLoading: boolean };

export type AprType =
  | OPERATOR_TYPE.CSM_DEF
  | OPERATOR_TYPE.CSM_ICS
  | OPERATOR_TYPE.CSM_IDVTC
  | OPERATOR_TYPE.CSM2_DEF;

const MIN_STAKE = Number(formatEther(MIN_EFFECTIVE_BALANCE));
const MAX_STAKE = Number(formatEther(MAX_EFFECTIVE_BALANCE));

const STAKE_PER_KEY: Record<AprType, number> = {
  [OPERATOR_TYPE.CSM_DEF]: MIN_STAKE,
  [OPERATOR_TYPE.CSM_ICS]: MIN_STAKE,
  [OPERATOR_TYPE.CSM_IDVTC]: MIN_STAKE,
  [OPERATOR_TYPE.CSM2_DEF]: MAX_STAKE,
};

const useTypeData = (type: AprType, smaApr: number | undefined) => {
  const curve = useOperatorTypeCurve(type);
  const available = !!curve && deployedModules.includes(curve.module);
  const { data: params, isLoading } = useCurveParameters(curve);

  const apr = useMemo(
    () =>
      smaApr !== undefined && params
        ? calcMaxApr({
            stApr: smaApr / 100,
            bondConfig: params.bondConfig,
            rewardsConfig: params.rewardsConfig,
            stakePerKey: STAKE_PER_KEY[type],
          })
        : undefined,
    [smaApr, params, type],
  );

  return {
    apr,
    available,
    firstKeyBond: params?.bondConfig[0]?.value,
    paramsLoading: isLoading,
  };
};

const useModuleCount = (module: MODULE_NAME) => {
  const deployed = deployedModules.includes(module);
  const { data, isLoading } = useOperatorsCount(module);

  return { deployed, count: data, isLoading };
};

export const useCsmStats = () => {
  const sma = useStethSmaApr();
  const def = useTypeData(OPERATOR_TYPE.CSM_DEF, sma.data);
  const ics = useTypeData(OPERATOR_TYPE.CSM_ICS, sma.data);
  const idvtc = useTypeData(OPERATOR_TYPE.CSM_IDVTC, sma.data);
  const csm2 = useTypeData(OPERATOR_TYPE.CSM2_DEF, sma.data);
  const csm = useModuleCount(MODULE_NAME.CSM);
  const csm02 = useModuleCount(MODULE_NAME.CSM_02);

  const all = [def, ics, idvtc, csm2];
  const toStat = (item: (typeof all)[number]): Stat<number> => ({
    value: item.apr,
    isLoading:
      item.available &&
      item.apr === undefined &&
      (sma.isPending || item.paramsLoading),
  });

  const aprs: Record<AprType, Stat<number>> = {
    [OPERATOR_TYPE.CSM_DEF]: toStat(def),
    [OPERATOR_TYPE.CSM_ICS]: toStat(ics),
    [OPERATOR_TYPE.CSM_IDVTC]: toStat(idvtc),
    [OPERATOR_TYPE.CSM2_DEF]: toStat(csm2),
  };

  const aprValues = all.flatMap(({ apr }) => (apr === undefined ? [] : [apr]));
  const maxApr: Stat<number> = {
    value: aprValues.length > 0 ? Math.max(...aprValues) : undefined,
    isLoading: Object.values(aprs).some(({ isLoading }) => isLoading),
  };

  const capitalTypes = [def, ics, idvtc];
  const bonds = capitalTypes.flatMap(({ firstKeyBond }) =>
    firstKeyBond === undefined ? [] : [firstKeyBond],
  );
  const capital: Stat<{ min: string; max: string }> = {
    value:
      bonds.length > 0
        ? {
            min: formatEther(bonds.reduce(bigMin)),
            max: formatEther(bonds.reduce(bigMax)),
          }
        : undefined,
    isLoading: capitalTypes.some(({ paramsLoading }) => paramsLoading),
  };

  const counts = [csm, csm02].filter(({ deployed }) => deployed);
  const operators: Stat<number> = {
    value:
      counts.length > 0 && counts.every(({ count }) => count !== undefined)
        ? counts.reduce((sum, { count }) => sum + Number(count), 0)
        : undefined,
    isLoading: counts.some(({ isLoading }) => isLoading),
  };

  return { aprs, maxApr, capital, operators };
};
