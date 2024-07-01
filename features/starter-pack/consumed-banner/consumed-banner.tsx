import { FC } from 'react';

import { Link } from '@lidofinance/lido-ui';
import { BannerHeader, BlockStyled } from './styles';

export const ConsumedBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        You have already joined CSM testnet during Early Adoption period
      </BannerHeader>
      <Link href="https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22">
        Learn more about Early Adoption.
      </Link>
    </BlockStyled>
  );
};
