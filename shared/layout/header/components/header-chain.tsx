import { CHAINS, getChainColor } from '@lido-sdk/constants';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';

import { useAccount } from 'shared/hooks';
import {
  DotStyle,
  HeaderWalletChainStyle,
  HeaderWalletChainWrapper,
} from '../styles';

const HeaderChain: FC = () => {
  const { active, chainId } = useAccount();

  const chainName = CHAINS[chainId];
  const testNet = chainId !== CHAINS.Mainnet;
  const showNet = testNet && active;

  return (
    <NoSSRWrapper>
      {showNet && (
        <HeaderWalletChainWrapper>
          <DotStyle />
          <HeaderWalletChainStyle $color={getChainColor(chainId)}>
            {chainName}
          </HeaderWalletChainStyle>
        </HeaderWalletChainWrapper>
      )}
    </NoSSRWrapper>
  );
};

export default HeaderChain;
