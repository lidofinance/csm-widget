import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { Performance, RateStatus, UnifiedPerformance } from 'types';

export const derivePerformance = (
  rate: UnifiedPerformance,
  leeway: number,
): Performance => {
  const offset = leeway / Number(PERCENT_BASIS);
  const threshold = rate.overallAttestationRate - offset;
  const goodThreshold = rate.overallAttestationRate - offset / 2;

  let status: RateStatus = 'semi';
  if (rate.operatorAttestationRate <= threshold) status = 'bad';
  else if (rate.operatorAttestationRate > goodThreshold) status = 'good';

  return { ...rate, threshold, status };
};
