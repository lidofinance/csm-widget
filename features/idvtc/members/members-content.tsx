import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useApprovedUnboundForm } from './hooks/use-approved-unbound-form';
import { useCanManageMembers } from './hooks/use-can-manage-members';
import { useOperatorMembers } from './hooks/use-operator-members';
import { useRotationRequest } from './hooks/use-rotation-request';
import { MembersSection } from './initialized/members-section';
import { NotInitialized } from './not-initialized/not-initialized';

export const MembersContent: FC = () => {
  const { data, isPending } = useOperatorMembers();
  const canManage = useCanManageMembers();
  const { isBindable, isPending: formPending } = useApprovedUnboundForm();
  const hasMembers = !!data && data.members.length > 0;
  const { data: request, isPending: rotationPending } = useRotationRequest(
    hasMembers || canManage,
  );

  // Wait for the rotation request whenever it drives the render: for members
  // (per-card pending/rejected states), and for a manager without members (a
  // pending from-scratch request must show its status, not the init editor).
  // Wait for the form status too when it gates the no-members init path, so a
  // manager never flashes bind ↔ from-scratch.
  if (
    isPending ||
    ((hasMembers || canManage) && rotationPending) ||
    (!hasMembers && canManage && formPending)
  ) {
    return <Loader data-testid="loader" />;
  }

  if (data && data.members.length > 0) {
    return (
      <MembersSection
        members={data.members}
        request={request ?? null}
        canManage={canManage}
      />
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
