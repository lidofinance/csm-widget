import { Typography } from '@lidofinance/lido-app-ui';
import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { formatPercent } from 'utils';

const INHERIT_FONT = { font: 'inherit' };

export const Performance: FC<
  Pick<ValidatorRewardsEntity, 'performance' | 'threshold' | 'slashed'>
> = ({ performance, threshold, slashed }) => (
  <Typography
    as="span"
    color={slashed || performance < threshold ? 'error' : undefined}
    style={INHERIT_FONT}
  >
    {slashed ? 'Slashed' : formatPercent(performance)}
  </Typography>
);
