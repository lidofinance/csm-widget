import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as MigalabsLink } from 'assets/icons/migalabs-link.svg';

type KeyLinkProps = {
  validator: string | undefined;
};

const { migalabs } = getExternalLinks();

export const MigalabsPubkeyLink: FC<KeyLinkProps> = ({ validator }) => {
  const href =
    migalabs && validator ? `${migalabs}/validators/${validator}` : '';

  return (
    <>
      {href && (
        <MatomoLink
          href={href}
          title="View on MigaLabs"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.migalabsPubkeyLink}
        >
          <MigalabsLink />
        </MatomoLink>
      )}
    </>
  );
};
