import { FC } from 'react';
import { LockSmall } from '@lidofinance/lido-ui';
import { Tooltip, TooltipProps } from '../../tooltip/tooltip';
import { LockWrapper } from './styles';

export const InputDecoratorLocked: FC<Partial<TooltipProps>> = (props) => (
  <Tooltip
    title="This field is calculated automatically"
    placement="top"
    {...props}
  >
    <LockWrapper>
      <LockSmall />
    </LockWrapper>
  </Tooltip>
);
