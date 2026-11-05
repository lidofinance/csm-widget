import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { useModuleMeta } from 'shared/hooks';

export const MaintenanceBanner: FC = () => {
  const moduleMeta = useModuleMeta();
  return (
    <BlockStyled>
      <BannerHeader>{moduleMeta.shortTitle} is under maintenance</BannerHeader>
      <p>Come back a while</p>
    </BlockStyled>
  );
};
