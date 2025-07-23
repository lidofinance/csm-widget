import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as EthseerLink } from 'assets/icons/ethseer-link.svg';
import { useChainName, useExternalLinks } from 'shared/hooks';

type KeyLinkProps = {
  validator: string | undefined;
};

export const EthseerPubkeyLink: FC<KeyLinkProps> = ({ validator }) => {
  const { ethseer } = useExternalLinks();
  const chainName = useChainName();
  const href =
    ethseer && validator
      ? `${ethseer}/validator/${validator}?network=${chainName}`
      : '';

  return (
    <>
      {href && (
        <MatomoLink
          href={href}
          title="View on EthSeer"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.ethseerPubkeyLink}
        >
          <EthseerLink />
        </MatomoLink>
      )}
    </>
  );
};
