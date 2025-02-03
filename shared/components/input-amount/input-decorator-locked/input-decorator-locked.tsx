import { FC } from 'react';
import { LockSmall, Tooltip, TooltipProps } from '@lidofinance/lido-ui';
import { LockWrapper } from './styles';

export const InputDecoratorLocked: FC<Partial<TooltipProps>> = (props) => (
  <Tooltip
    title="This field is calculated automatically based on the number of keys and the bond curve.  Follow the FAQ section to learn more"
    placement="top"
    {...props}
  >
    <LockWrapper>
      <LockSmall />
    </LockWrapper>
  </Tooltip>
);
