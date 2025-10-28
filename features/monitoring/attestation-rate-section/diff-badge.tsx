import { FC } from 'react';
import { RateStatus } from 'types';
import { formatPercent } from 'utils';
import { BadgeStyle } from './styles';

import { ReactComponent as DownIcon } from 'assets/icons/triangle-down.svg';
import { ReactComponent as UpIcon } from 'assets/icons/triangle-up.svg';

export const DiffBadge: FC<{
  values: [number, number];
  status: RateStatus;
}> = ({ values, status }) => {
  const diff = values[0] - values[1];
  return (
    <BadgeStyle $variant={status}>
      {diff > 0 ? <UpIcon /> : <DownIcon />}
      {formatPercent(Math.abs(diff))}
    </BadgeStyle>
  );
};
