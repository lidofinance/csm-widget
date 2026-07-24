import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { moduleMeta } from 'consts';

export const MaintenanceBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>{moduleMeta.shortTitle} is under maintenance</BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
