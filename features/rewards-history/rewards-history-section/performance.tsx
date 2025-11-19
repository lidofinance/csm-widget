import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { formatPercent } from 'utils';
import { PerformanceStyled } from './styles';

export const Performance: FC<
  Pick<ValidatorRewardsEntity, 'performance' | 'threshold' | 'slashed'>
> = ({ performance, threshold, slashed }) => {
  return (
    <PerformanceStyled $error={slashed || performance < threshold}>
      {slashed ? 'Slashed' : formatPercent(performance)}
    </PerformanceStyled>
  );
};
