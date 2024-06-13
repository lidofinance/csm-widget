import { FC } from 'react';

import { Link } from '@lidofinance/lido-ui';
import { BannerHeader, BlockStyled } from './styles';

export const ConsumedBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        You have already joined CSM testnet during Early Adoption period
      </BannerHeader>
      <Link>Learn more about Early Adoption.</Link>
    </BlockStyled>
  );
};
