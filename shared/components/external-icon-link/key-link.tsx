import { FC } from 'react';
import { ExternalIconLink } from './external-icon-link';
import { useAccount } from 'shared/hooks';
import { getKeyLingGetter } from 'consts/csm-key-link-getter';

type KeyLinkProps = {
  pubkey: string;
};

export const KeyLink: FC<KeyLinkProps> = ({ pubkey }) => {
  const { chainId } = useAccount();
  const getter = getKeyLingGetter(chainId);

  if (!getter) return null;

  return <ExternalIconLink href={getter(pubkey)} />;
};
