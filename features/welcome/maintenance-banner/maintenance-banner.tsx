import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { MODULE_SHORT_TITLE } from 'consts';
import { config } from 'config';

export const MaintenanceBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>
        {MODULE_SHORT_TITLE[config.module]} is under maintenance
      </BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
