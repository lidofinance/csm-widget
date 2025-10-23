import { FormTitle } from 'shared/components';
import { InviteButtonsHookForm } from 'shared/hook-form/controls';
import { useAcceptInviteFormData } from '../context';

export const InviteSelector = () => {
  const { invites } = useAcceptInviteFormData(true);

  return (
    <>
      <FormTitle>Choose request to accept</FormTitle>
      <InviteButtonsHookForm options={invites} />
    </>
  );
};
