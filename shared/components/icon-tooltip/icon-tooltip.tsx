import { Tooltip } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';

import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { ReactComponent as CalendarIcon } from 'assets/icons/info-calendar.svg';
import { IconStyle } from './style';

type Props = Omit<ComponentProps<typeof Tooltip>, 'title' | 'children'> & {
  tooltip?: string;
  type?: 'info' | 'calendar';
  inline?: boolean;
};

export const IconTooltip: FC<Props> = ({
  tooltip,
  type = 'info',
  placement = 'bottomLeft',
  inline,
  ...rest
}) =>
  tooltip ? (
    <>
      {inline && <>&nbsp;</>}
      <Tooltip placement={placement} title={tooltip} {...rest}>
        <IconStyle inline={inline}>
          {type === 'calendar' ? <CalendarIcon /> : <InfoIcon />}
        </IconStyle>
      </Tooltip>
    </>
  ) : null;
