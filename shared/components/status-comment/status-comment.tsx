import { FC } from 'react';
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
  CommentWithStrikes,
} from './comments';
import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { CommentStyle } from './styles';

type Props = {
  statuses: KEY_STATUS[];
};

export const StatusComment: FC<Props> = (props) => {
  return (
    <CommentStyle>
      <Comment {...props} />
    </CommentStyle>
  );
};

const Comment: FC<Props> = ({ statuses }) => {
  if (
    statuses.includes(KEY_STATUS.INVALID) ||
    statuses.includes(KEY_STATUS.DUPLICATED)
  )
    return <CommentInvalid />;

  if (statuses.includes(KEY_STATUS.EXIT_REQUESTED))
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

  if (statuses.includes(KEY_STATUS.WITH_STRIKES)) return <CommentWithStrikes />;

  return null;
};
