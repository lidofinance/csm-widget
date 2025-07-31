import { FC } from 'react';
import { LockSmall, Tooltip, TooltipProps } from '@lidofinance/lido-ui';
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
