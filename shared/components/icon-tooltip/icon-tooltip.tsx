import { Tooltip, Question } from '@lidofinance/lido-ui';
import { ComponentProps, FC, ReactNode } from 'react';

import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { ReactComponent as CalendarIcon } from 'assets/icons/info-calendar.svg';
import { IconStyle } from './style';

type Props = Omit<ComponentProps<typeof Tooltip>, 'title' | 'children'> & {
  tooltip?: ReactNode;
  type?: 'info' | 'question' | 'calendar';
  inline?: boolean;
};

export const IconTooltip: FC<Props> = ({
  tooltip,
  inline,
  type = 'info',
  placement = 'bottomLeft',
  ...rest
}) =>
  tooltip ? (
    <>
      {inline && <>&nbsp;</>}
      <Tooltip placement={placement} title={tooltip} {...rest}>
        <IconStyle inline={inline} data-testid="iconTooltip">
          {getIcon(type)}
        </IconStyle>
      </Tooltip>
    </>
  ) : null;

const getIcon = (type: Props['type']) => {
  switch (type) {
    case 'question':
      return <Question />;
    case 'calendar':
      return <CalendarIcon />;
    default:
      return <InfoIcon />;
  }
};
