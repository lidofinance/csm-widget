import { FormTitle } from 'shared/components';
import { InviteButtonsHookForm } from 'shared/hook-form/controls/invite-buttons-hook-form';
import { useAcceptInviteFormData } from '../context';

export const InviteSelector = () => {
  const { invites } = useAcceptInviteFormData();

  return (
    <>
      <FormTitle>Choose request to accept</FormTitle>
      <InviteButtonsHookForm options={invites || []} />
    </>
  );
};
