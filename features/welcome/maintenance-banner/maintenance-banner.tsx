import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { MODULE_METADATA } from 'consts';
import { config } from 'config';

export const MaintenanceBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        {MODULE_METADATA[config.module].shortTitle} is under maintenance
      </BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
