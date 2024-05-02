import { FC } from 'react';
import { LockSmall, Tooltip } from '@lidofinance/lido-ui';
import { LockWrapper } from './styles';

export const InputDecoratorLocked: FC = (props) => (
  <Tooltip title="Calculated automatically" placement="top" {...props}>
    <LockWrapper>
      <LockSmall />
    </LockWrapper>
  </Tooltip>
);
