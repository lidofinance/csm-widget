import {
  useCurveParameters,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { FC } from 'react';
import { useStrikeDates } from 'shared/hooks';
import type { KeyStrikes } from '@lidofinance/lido-csm-sdk';
import { getStrikeDots } from './get-strike-dots';
import { StrikeDotsView } from './strike-dots-view';

export const StrikeDots: FC<{ strikes?: Readonly<KeyStrikes> }> = ({
  strikes,
}) => {
  const { nodeOperator } = useNodeOperator();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const { data: threshold } = useCurveParameters(curve, (p) =>
    Number(p.strikesConfig.threshold),
  );
  const getDates = useStrikeDates(undefined);

  const state = getStrikeDots(strikes, threshold ?? 0);
  const lastStrikeDate =
    state.lastStrikeIndex === undefined
      ? undefined
      : getDates(state.lastStrikeIndex)?.receivedTimestamp;

  return <StrikeDotsView {...state} lastStrikeDate={lastStrikeDate} />;
};
