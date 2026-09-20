import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';

export const PausedBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>Staking modules are paused</BannerHeader>
      <p>
        This means that uploading new keys is currently not possible, but Node
        Operator stats can be viewed
      </p>
    </BlockStyled>
  );
};
