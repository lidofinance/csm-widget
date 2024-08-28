import { getExternalLinks } from 'consts/external-links';
import { FC } from 'react';
import { useAccount } from 'shared/hooks';
import { ExternalIconLink } from './external-icon-link';

type KeyLinkProps = {
  pubkey: string;
};

export const KeyLink: FC<KeyLinkProps> = ({ pubkey }) => {
  const { chainId } = useAccount();
  const { beaconchain } = getExternalLinks(chainId);

  return (
    <ExternalIconLink
      href={`${beaconchain}/validator/${pubkey}`}
      title="View on beaconcha.in"
    />
  );
};
