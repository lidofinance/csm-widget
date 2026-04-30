import { CONTRACT_NAMES } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { FC, PropsWithChildren } from 'react';
import { useChainName } from 'shared/hooks';
import { getEtherscanAddressLink } from 'utils';
import { CopyLink } from '../copy-button';
import { FaqLink } from './faq-link';

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
  const { sm } = useLidoSDK();
  const address = sm.core.getContractAddress(CONTRACT_NAMES.withdrawalVault);
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <>
      <FaqLink href={url}>
        <code>{address}</code>
      </FaqLink>
      <CopyLink text={address} />
    </>
  );
};

export const FaqLidoRewardsVault: FC = () => {
  const { chainId } = useDappStatus();
  const { sm } = useLidoSDK();
  const address = sm.core.getContractAddress(CONTRACT_NAMES.lidoRewardsVault);
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <>
      <FaqLink href={url}>
        <code>{address}</code>
      </FaqLink>
      <CopyLink text={address} />
    </>
  );
};
