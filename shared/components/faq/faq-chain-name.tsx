import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { CSM_CONTRACT_ADDRESSES } from '@lidofinance/lido-csm-sdk';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { useChainName } from 'shared/hooks';
import { FaqLink } from './faq-link';

export const FaqChainName: FC = () => {
  const chainName = useChainName(false);
  return <>{chainName}</>;
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
