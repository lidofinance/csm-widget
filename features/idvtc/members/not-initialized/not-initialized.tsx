import { FC, useState } from 'react';
import type { RotationRequestDto } from 'modules/surveys-sdk/generated';
import { InitButton } from './init-button';
import { InitEditor } from './init-editor';
import { InitRequestStatus } from './init-request-status';
import { NotInitializedInfo } from './not-initialized-info';

type NotInitializedProps = {
  request: RotationRequestDto | null;
  canManage: boolean;
  isBindable: boolean;
};

// No active members yet. A manager/reward either binds an approved IDVTC form
// (InitButton, instant) or defines all four members from scratch via an init
// rotation request (InitEditor → REVIEW). The two are mutually exclusive by
// state; a pending/rejected from-scratch request takes priority.
export const NotInitialized: FC<NotInitializedProps> = ({
  request,
  canManage,
  isBindable,
}) => {
  const [editing, setEditing] = useState(false);

  if (!canManage) return <NotInitializedInfo />;

  const pendingRequest =
    request && (request.status === 'REVIEW' || request.status === 'REJECTED')
      ? request
      : null;

  if (editing || (!pendingRequest && !isBindable)) {
    return (
      <InitEditor
        cancelable={!!pendingRequest}
        onDone={() => setEditing(false)}
      />
    );
  }

  if (pendingRequest) {
    return (
      <InitRequestStatus
        request={pendingRequest}
        canManage={canManage}
        onNewRequest={() => setEditing(true)}
      />
    );
  }

  return <InitButton />;
};
