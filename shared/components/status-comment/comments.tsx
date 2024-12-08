import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';
import { MatomoLink } from '../matomo-link/matomo-link';
import { FC } from 'react';

// FIXME: links, matomo, FAQ
export const CommentExitRequested: FC = () => <>Exit the key from the CL</>;

export const CommentUnbonded: FC = () => (
  <>Top up the bond or Exit the key from the CL</>
);

export const CommentInvalid: FC = () => <>Remove the key</>;

export const CommentUnchecked: FC = () => (
  <>
    Resolve the issues with all keys in <b>Duplicated</b> and{' '}
    <b>Invalid signature</b>
    statuses
  </>
);

export const CommentUnbondedNonQueued: FC = () => (
  <>Top up the bond or Remove the key</>
);

export const CommentNonQueued: FC = () => (
  <>
    If you have <b>Stuck</b> or <b>Unbonded</b> keys — resolve the issues with
    them <br />
    If there are no <b>Stuck</b> or <b>Unbonded</b> keys — put this key back to
    the queue (
    <LocalLink
      href={PATH.KEYS_NORMALIZE}
      // matomoEvent={MATOMO_CLICK_EVENTS_TYPES.normalizeQueueComment}
    >
      Normalize queue
    </LocalLink>
    )
  </>
);

export const CommentExiting: FC = () => (
  <MatomoLink
    href="#when-validator-become-withdrawn"
    // matomoEvent={MATOMO_CLICK_EVENTS_TYPES.whenValidatorWithdrawnComment}
  >
    When does the validator become withdrawn?
  </MatomoLink>
);

export const CommentDepositable: FC = () => (
  <MatomoLink
    href="#when-validator-become-active"
    // matomoEvent={MATOMO_CLICK_EVENTS_TYPES.whenValidatorActiveComment}
  >
    When does the validator become active?
  </MatomoLink>
);
