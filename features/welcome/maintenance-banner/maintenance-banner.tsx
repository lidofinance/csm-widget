import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';

export const MaintenanceBanenr: FC = () => {
  return (
    <BlockStyled>
      <BannerHeader>CSM is under maintenance</BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
