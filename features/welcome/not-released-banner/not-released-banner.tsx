import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { FC } from 'react';
import { NotReleasedBlock } from './styles';

const { defaultChain } = getConfig();

export const NotReleasedBanner: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;

  return (
    <NotReleasedBlock>
      CSM is not live on {isMainnet ? 'Mainnet' : 'Testnet'} yet
    </NotReleasedBlock>
  );
};
