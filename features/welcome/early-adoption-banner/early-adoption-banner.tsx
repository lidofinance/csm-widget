import { FC } from 'react';

import { Link } from '@lidofinance/lido-ui';
import { BannerHeader, BlockStyled } from './styles';

export const EarlyAdoptionBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>Early Adoption mode is active</BannerHeader>
      <p>
        During this period, only <Link>curated community stakers</Link> are
        eligible to join CSM. After the end of the period, CSM entry will be
        fully permissionless.
      </p>
      <Link>Learn more about Early Adoption.</Link>
    </BlockStyled>
  );
};
