import { FC } from 'react';
import { useStrikeDates } from 'shared/hooks';
import type { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { getStrikeDots } from './get-strike-dots';
import { StrikeDotsView } from './strike-dots-view';
import { useStrikesThreshold } from './use-strikes-threshold';

export const StrikeDots: FC<{ strikes?: Readonly<KeyStrikes> }> = ({
  strikes,
}) => {
  const threshold = useStrikesThreshold();
  const getDates = useStrikeDates(undefined);

  const state = getStrikeDots(strikes, threshold ?? 0);
  const lastStrikeDate =
    state.lastStrikeIndex === undefined
      ? undefined
      : getDates(state.lastStrikeIndex)?.receivedTimestamp;

  return <StrikeDotsView {...state} lastStrikeDate={lastStrikeDate} />;
};
