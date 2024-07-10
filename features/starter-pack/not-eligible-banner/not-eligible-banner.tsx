import { FC } from 'react';

import { Link } from '@lidofinance/lido-ui';
import { BannerHeader, BlockStyled } from './styles';

export const NotEligibleBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        You are not eligible to join CSM during Early&nbsp;Adoption&nbsp;period
      </BannerHeader>
      <p>
        You will be most welcome when the module is on the permissionless phase.
      </p>
      <Link href="https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22">
        Learn more about Early Adoption.
      </Link>
    </BlockStyled>
  );
};
