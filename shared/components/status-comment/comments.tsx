import { HOW_TO_EXIT_VALIDATOR_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { MatomoLink } from '../matomo-link/matomo-link';

// TODO: add matomo events
// TODO: check role
export const CommentExitRequested: FC = () => (
  <MatomoLink
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToExitLinkComment}
    href={HOW_TO_EXIT_VALIDATOR_LINK}
  >
    Exit the key from the CL
  </MatomoLink>
);

export const CommentUnbonded: FC = () => (
  <>
    <LocalLink href={PATH.BOND_ADD}>Top up the bond</LocalLink> or{' '}
    <MatomoLink
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToExitLinkComment}
      href={HOW_TO_EXIT_VALIDATOR_LINK}
    >
      Exit the key from the CL
    </MatomoLink>
  </>
);

export const CommentInvalid: FC = () => (
  <LocalLink href={PATH.KEYS_REMOVE}>Remove the key</LocalLink>
);

export const CommentUnchecked: FC = () => (
  <>
    Resolve the issues with all keys in <b>Duplicated</b> and <b>Invalid</b>{' '}
    statuses
  </>
);

export const CommentUnbondedNonQueued: FC = () => (
  <>
    <LocalLink href={PATH.BOND_ADD}>Top up the bond</LocalLink> or{' '}
    <LocalLink href={PATH.KEYS_REMOVE}>Remove the key</LocalLink>
  </>
);

export const CommentNonQueued: FC = () => (
  <>
    If you have <b>Stuck</b> or <b>Unbonded</b> keys — resolve the issues with
    them <br />
    If there are no <b>Stuck</b> or <b>Unbonded</b> keys — put this key back to
    the queue (<LocalLink href={PATH.KEYS_NORMALIZE}>Normalize queue</LocalLink>
    )
  </>
);

export const CommentExiting: FC = () => (
  <LocalLink href={PATH.KEYS_VIEW} anchor="#when-validator-become-withdrawn">
    When does the validator become withdrawn?
  </LocalLink>
);

export const CommentDepositable: FC = () => (
  <LocalLink href={PATH.KEYS_VIEW} anchor="#when-validator-become-active">
    When does the validator become active?
  </LocalLink>
);
