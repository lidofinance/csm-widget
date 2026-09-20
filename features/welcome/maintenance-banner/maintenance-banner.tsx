import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { WIDGET_TITLE } from 'consts';

export const MaintenanceBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>{WIDGET_TITLE} is under maintenance</BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
