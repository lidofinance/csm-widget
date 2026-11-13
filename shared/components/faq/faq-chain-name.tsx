import { CONTRACT_NAMES, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Copy } from '@lidofinance/lido-app-ui';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { MODULE_METADATA } from 'consts/module';
import { useDappStatus, useModule, useSmSDK } from 'modules/web3';
import { FC, PropsWithChildren } from 'react';
import { notifyCopied, useChainName } from 'shared/hooks';
import styled from 'styled-components';
import { getEtherscanAddressLink } from 'utils';
import { FaqLink } from './faq-link';

const AddressCode = styled.code`
  word-break: break-all;
`;

const StyledCopy = styled(Copy)`
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

export const FaqIfModule: FC<PropsWithChildren<{ module: MODULE_NAME }>> = ({
  module,
  children,
}) => {
  const sm = useSmSDK(module);
  return sm ? <>{children}</> : null;
};

export const FaqModuleName: FC = () => {
  const { module } = useModule();
  return <>{MODULE_METADATA[module ?? MODULE_NAME.CSM].variantName}</>;
};

const FaqContractAddress: FC<{ name: CONTRACT_NAMES }> = ({ name }) => {
  const { chainId } = useDappStatus();
  const sm = useSmSDK(MODULE_NAME.CSM);
  const address = sm?.core.getContractAddress(name);
  if (!address) return null;

  const url = getEtherscanAddressLink(chainId, address);
  return (
    <>
      <FaqLink href={url} $inline>
        <AddressCode>{address}</AddressCode>
      </FaqLink>
      <StyledCopy text={address} onCopy={notifyCopied} />
    </>
  );
};

export const FaqWithdrawalVault: FC = () => (
  <FaqContractAddress name={CONTRACT_NAMES.withdrawalVault} />
);

export const FaqLidoRewardsVault: FC = () => (
  <FaqContractAddress name={CONTRACT_NAMES.lidoRewardsVault} />
);
