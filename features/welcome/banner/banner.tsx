import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { Connect } from 'shared/wallet';
import { BannerHeader } from './styles';

export const Banner: FC = () => {
  return (
    <Block>
      <BannerHeader>CSM node operator starter pack</BannerHeader>
      <p>
        Make sure you’ve completed all the basic steps before joining the
        Community Staking Module
      </p>
      <br />
      <Connect fullwidth />
    </Block>
  );
};
