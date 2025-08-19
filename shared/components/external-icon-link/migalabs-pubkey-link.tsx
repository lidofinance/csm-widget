import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as MigalabsLink } from 'assets/icons/migalabs-link.svg';
import { useExternalLinks } from 'shared/hooks';

type KeyLinkProps = {
  validator: string | undefined;
};

export const MigalabsPubkeyLink: FC<KeyLinkProps> = ({ validator }) => {
  const { migalabs } = useExternalLinks();
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
