import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { getChainName } from 'utils';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as EthseerLink } from 'assets/icons/ethseer-link.svg';

type KeyLinkProps = {
  validator: string | undefined;
};

const { ethseer } = getExternalLinks();
const chainName = getChainName();

export const EthseerPubkeyLink: FC<KeyLinkProps> = ({ validator }) => {
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
