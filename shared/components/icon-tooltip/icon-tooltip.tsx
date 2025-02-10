import { Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { ReactComponent as CalendarIcon } from 'assets/icons/info-calendar.svg';
import { IconStyle } from './style';

type Props = {
  tooltip?: string;
  type?: 'info' | 'calendar';
};

export const IconTooltip: FC<Props> = ({ tooltip, type = 'info' }) => (
  <>
    {tooltip && (
      <Tooltip placement="bottomLeft" title={tooltip}>
        <IconStyle>
          {type === 'calendar' ? <CalendarIcon /> : <InfoIcon />}
        </IconStyle>
      </Tooltip>
    )}
  </>
);
