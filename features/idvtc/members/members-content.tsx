import { Button, Loader } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { Stack } from 'shared/components';
import { useCanManageMembers } from './hooks/use-can-manage-members';
import { useOperatorMembers } from './hooks/use-operator-members';
import { useRotationRequest } from './hooks/use-rotation-request';
import { MembersList } from './initialized/members-list';
import { InitButton } from './not-initialized/init-button';
import { NotInitializedInfo } from './not-initialized/not-initialized-info';
import { RotationEditor } from './rotation/rotation-editor';
import { RotationStatus } from './rotation/rotation-status';

export const MembersContent: FC = () => {
  const { data, isPending } = useOperatorMembers();
  const canManage = useCanManageMembers();
  const hasMembers = !!data && data.members.length > 0;
  const { data: request, isPending: rotationPending } =
    useRotationRequest(hasMembers);
  const [editing, setEditing] = useState(false);

  // Wait for the rotation request too (only relevant once members exist) so an
  // operator with a pending request never flashes the "Request rotation" button.
  if (isPending || (hasMembers && rotationPending)) {
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

  return canManage ? <InitButton /> : <NotInitializedInfo />;
};
