import { FeeSplit, PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';

export const useRewardsAddressShare = (feeSplits: Partial<FeeSplit>[]) =>
  useMemo(() => {
    const totalShare = feeSplits.reduce((sum, s) => sum + (s.share ?? 0n), 0n);
    const share = PERCENT_BASIS - totalShare;
    return share < 0n ? 0n : share;
  }, [feeSplits]);
