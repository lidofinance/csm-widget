import { FC } from 'react';
import { KEY_STATUS } from 'consts/key-status';
import {
  CommentActivationPending,
  CommentDepositable,
  CommentExiting,
  CommentExitRequested,
  CommentInvalid,
  CommentNonQueued,
  CommentUnbonded,
  CommentUnbondedNonQueued,
  CommentUnchecked,
} from './comments';

export const StatusComment: FC<{ statuses: KEY_STATUS[] }> = ({ statuses }) => {
  if (
    statuses.includes(KEY_STATUS.INVALID) ||
    statuses.includes(KEY_STATUS.DUPLICATED)
  )
    return <CommentInvalid />;

  if (
    statuses.includes(KEY_STATUS.EXIT_REQUESTED) ||
    statuses.includes(KEY_STATUS.STUCK)
  )
    return <CommentExitRequested />;

  if (
    statuses.includes(KEY_STATUS.UNBONDED) &&
    statuses.includes(KEY_STATUS.NON_QUEUED)
  )
    return <CommentUnbondedNonQueued />;

  if (
    statuses.includes(KEY_STATUS.UNBONDED) &&
    statuses.includes(KEY_STATUS.WITHDRAWAL_PENDING)
  )
    return <CommentExiting />;

  if (statuses.includes(KEY_STATUS.UNBONDED)) return <CommentUnbonded />;

  if (statuses.includes(KEY_STATUS.UNCHECKED)) return <CommentUnchecked />;

  if (statuses.includes(KEY_STATUS.NON_QUEUED)) return <CommentNonQueued />;

  if (
    statuses.includes(KEY_STATUS.WITHDRAWAL_PENDING) ||
    statuses.includes(KEY_STATUS.EXITING)
  )
    return <CommentExiting />;

  if (statuses.includes(KEY_STATUS.ACTIVATION_PENDING))
    return <CommentActivationPending />;

  if (statuses.includes(KEY_STATUS.DEPOSITABLE)) return <CommentDepositable />;

  return null;
};
