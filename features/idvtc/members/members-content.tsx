import { Button, Loader } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { Stack } from 'shared/components';
import { useApprovedUnboundForm } from './hooks/use-approved-unbound-form';
import { useCanManageMembers } from './hooks/use-can-manage-members';
import { useOperatorMembers } from './hooks/use-operator-members';
import { useRotationRequest } from './hooks/use-rotation-request';
import { MembersList } from './initialized/members-list';
import { NotInitialized } from './not-initialized/not-initialized';
import { RotationEditor } from './rotation/rotation-editor';
import { RotationStatus } from './rotation/rotation-status';

export const MembersContent: FC = () => {
  const { data, isPending } = useOperatorMembers();
  const canManage = useCanManageMembers();
  const { isBindable, isPending: formPending } = useApprovedUnboundForm();
  const hasMembers = !!data && data.members.length > 0;
  const { data: request, isPending: rotationPending } = useRotationRequest(
    hasMembers || canManage,
  );
  const [editing, setEditing] = useState(false);

  // Wait for the rotation request whenever it drives the render: for members
  // (Request rotation vs status), and for a manager without members (a pending
  // from-scratch request must show its status, not the init editor). Wait for
  // the form status too when it gates the no-members init path, so a manager
  // never flashes bind ↔ from-scratch.
  if (
    isPending ||
    ((hasMembers || canManage) && rotationPending) ||
    (!hasMembers && canManage && formPending)
  ) {
    return <Loader />;
  }

  if (data && data.members.length > 0) {
    const showStatus =
      !!request &&
      (request.status === 'REVIEW' || request.status === 'REJECTED');

    return (
      <Stack direction="column" gap="xl">
        <MembersList members={data.members} />
        {editing ? (
          <RotationEditor
            mode="rotate"
            activeMembers={data.members}
            onDone={() => setEditing(false)}
          />
        ) : showStatus ? (
          <RotationStatus
            request={request}
            canManage={canManage}
            onReplace={() => setEditing(true)}
          />
        ) : (
          canManage && (
            <Button
              onClick={() => setEditing(true)}
              fullwidth
              data-testid="requestRotationButton"
            >
              Request rotation
            </Button>
          )
        )}
      </Stack>
    );
  }

  return (
    <NotInitialized
      request={request ?? null}
      canManage={canManage}
      isBindable={isBindable}
    />
  );
};
