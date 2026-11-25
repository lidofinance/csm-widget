import { Typography } from '@lidofinance/lido-app-ui';
import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { formatPercent } from 'utils';

export const Performance: FC<
  Pick<ValidatorRewardsEntity, 'performance' | 'threshold' | 'slashed'>
> = ({ performance, threshold, slashed }) => (
  <Typography
    variant="inherit"
    color={slashed || performance < threshold ? 'error' : undefined}
  >
    {slashed ? 'Slashed' : formatPercent(performance)}
  </Typography>
);
