import { FC, memo } from 'react';

import { Block } from '@lidofinance/lido-ui';
import { Info } from './info';

export const ViewRoleSection: FC = memo(() => {
  return (
    <Block>
      <Info />
    </Block>
  );
});
