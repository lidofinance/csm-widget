import { FC, useState } from 'react';
import type { RotationRequestDto } from 'modules/surveys-sdk/generated';
import { RotationEditor } from '../rotation/rotation-editor';
import { RotationStatus } from '../rotation/rotation-status';
import { InitButton } from './init-button';
import { NotInitializedInfo } from './not-initialized-info';

type NotInitializedProps = {
  request: RotationRequestDto | null;
  canManage: boolean;
  isBindable: boolean;
};

// No active members yet. A manager/reward either binds an approved IDVTC form
// (InitButton, instant) or defines all four members from scratch via an init
// rotation request (RotationEditor mode="init" → REVIEW). The two are mutually
// exclusive by state; a pending/rejected from-scratch request takes priority.
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
      <RotationEditor
        mode="init"
        activeMembers={[]}
        cancelable={!!pendingRequest}
        onDone={() => setEditing(false)}
      />
    );
  }

  if (pendingRequest) {
    return (
      <RotationStatus
        request={pendingRequest}
        canManage={canManage}
        onReplace={() => setEditing(true)}
      />
    );
  }

  return <InitButton />;
};
