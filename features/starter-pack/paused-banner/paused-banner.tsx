import { FC } from 'react';

import { BannerHeader, BlockStyled } from './styles';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { HoleskyBanner } from 'features/welcome/holesky-banner';

const { defaultChain } = getConfig();

export const PausedBanner: FC = () => {
  if (defaultChain === CHAINS.Holesky) {
    return <HoleskyBanner />;
  }

  return (
    <BlockStyled>
      <BannerHeader>CSM is paused</BannerHeader>
      <p>
        This means that uploading new keys is currently not possible, but Node
        Operator stats can be viewed.
      </p>
    </BlockStyled>
  );
};
