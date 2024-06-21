import { FC } from 'react';

import { Link } from '@lidofinance/lido-ui';
import { BannerHeader, BlockStyled } from './styles';

export const NotEligibleBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        You are not eligible to join CSM during Early Adoption period
      </BannerHeader>
      <p>Come back later when we’re</p>
      <Link>Learn more about Early Adoption.</Link>
    </BlockStyled>
  );
};
