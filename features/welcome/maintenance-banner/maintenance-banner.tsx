import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';

export const MaintenanceBanner: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>CSM is under maintenance</BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
