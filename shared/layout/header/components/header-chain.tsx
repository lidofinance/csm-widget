import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { useChainColor, useChainName } from 'shared/hooks';
import {
  DotStyle,
  HeaderWalletChainStyle,
  HeaderWalletChainWrapper,
} from '../styles';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const HeaderChain: FC = () => {
  const { chainId } = useDappStatus();
  const chainColor = useChainColor();
  const chainName = useChainName(true);

  const showNet = chainId !== CHAINS.Mainnet;

  return (
    <NoSSRWrapper>
      {showNet && (
        <HeaderWalletChainWrapper>
          <DotStyle />
          <HeaderWalletChainStyle $color={chainColor}>
            {chainName}
          </HeaderWalletChainStyle>
        </HeaderWalletChainWrapper>
      )}
    </NoSSRWrapper>
  );
};

export default HeaderChain;
