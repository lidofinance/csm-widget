import { FormTitle } from 'shared/components';
import { InviteButtonsHookForm } from 'shared/hook-form/controls/invite-buttons-hook-form';
import { useAcceptInviteFormData } from '../context';

export const InviteSelector = () => {
  const {
    invites,
    loading: { isInvitesLoading },
  } = useAcceptInviteFormData();
  const isLoading = isInvitesLoading;

  if (isLoading) {
    return <div>...loading...</div>;
  }

  return (
    <>
      <FormTitle>Choose request to accept</FormTitle>
      <InviteButtonsHookForm options={invites || []} />
    </>
  );
};
