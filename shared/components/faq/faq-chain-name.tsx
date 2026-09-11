import { CONTRACT_NAMES } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';
import { useDappStatus, useSmSDK } from 'modules/web3';
import { FC, PropsWithChildren } from 'react';
import { useChainName } from 'shared/hooks';
import styled from 'styled-components';
import { getEtherscanAddressLink } from 'utils';
import { CopyLink } from '../copy-button';
import { FaqLink } from './faq-link';

const AddressCode = styled.code`
  word-break: break-all;
`;

const StyledCopy = styled(CopyLink)`
  margin: -8px 0 -4px;
  vertical-align: middle;
`;

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

const FaqContractAddress: FC<{ name: CONTRACT_NAMES }> = ({ name }) => {
  const { chainId } = useDappStatus();
  const sm = useSmSDK(config.module);
  const address = sm?.core.getContractAddress(name);
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <>
      <FaqLink href={url} $inline>
        <AddressCode>{address}</AddressCode>
      </FaqLink>
      <StyledCopy text={address} />
    </>
  );
};

export const FaqWithdrawalVault: FC = () => (
  <FaqContractAddress name={CONTRACT_NAMES.withdrawalVault} />
);

export const FaqLidoRewardsVault: FC = () => (
  <FaqContractAddress name={CONTRACT_NAMES.lidoRewardsVault} />
);
