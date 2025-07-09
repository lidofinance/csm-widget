import { CSM_CONTRACT_ADDRESSES } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren } from 'react';
import { useChainName } from 'shared/hooks';
import { FaqLink } from './faq-link';
import { getEtherscanAddressLink } from 'utils';

export const FaqChainName: FC = () => {
  const chainName = useChainName(false);
  return <>{chainName}</>;
};

export const FaqDiscordChannel: FC = () => {
  const { chainId } = useDappStatus();
  const isMainnet = chainId === CHAINS.Mainnet;
  return <>csm-{isMainnet ? 'mainnet' : 'testnet'}</>;
};

export const FaqOnlyMainnet: FC<PropsWithChildren> = ({ children }) => {
  const { chainId } = useDappStatus();
  const isMainnet = chainId === CHAINS.Mainnet;
  return isMainnet ? <>{children}</> : null;
};

export const FaqOnlyTestnet: FC<PropsWithChildren> = ({ children }) => {
  const { chainId } = useDappStatus();
  const isMainnet = chainId === CHAINS.Mainnet;
  return !isMainnet ? <>{children}</> : null;
};

export const FaqWithdrawalVault: FC = () => {
  const { chainId } = useDappStatus();
  const address = CSM_CONTRACT_ADDRESSES[chainId]?.withdrawalVault;
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <FaqLink href={url}>
      <code>{address}</code>
    </FaqLink>
  );
};

export const FaqLidoRewardsVault: FC = () => {
  const { chainId } = useDappStatus();
  const address = CSM_CONTRACT_ADDRESSES[chainId]?.lidoRewardsVault;
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <FaqLink href={url}>
      <code>{address}</code>
    </FaqLink>
  );
};
