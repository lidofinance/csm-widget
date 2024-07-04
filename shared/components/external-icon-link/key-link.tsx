import { FC } from 'react';
import { ExternalIconLink } from './external-icon-link';
import { useAccount } from 'shared/hooks';
import {
  VALIDATOR_LINK_NAME,
  getValidatorLinkGetter,
} from 'consts/validator-link-getter';

type KeyLinkProps = {
  pubkey: string;
};

export const KeyLink: FC<KeyLinkProps> = ({ pubkey }) => {
  const { chainId } = useAccount();
  const getValidatorLink = getValidatorLinkGetter(chainId);

  if (!getValidatorLink) return null;

  return (
    <ExternalIconLink
      href={getValidatorLink(pubkey)}
      title={`View on ${VALIDATOR_LINK_NAME}`}
    />
  );
};
