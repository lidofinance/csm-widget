import { Text } from '@lidofinance/lido-ui';
import { FormTitle } from 'shared/components';
import { InviteButtonsHookForm } from 'shared/hook-form/controls';
import { useAcceptInviteFormData } from '../context';

export const InviteSelector = () => {
  const { invites } = useAcceptInviteFormData(true);

  return (
    <>
      <FormTitle>Choose request to accept</FormTitle>
      <Text size="xs">
        This section shows pending requests to assign this wallet as a Manager
        or Rewards address for a Node Operator. Select a request and accept it
        by signing a transaction.
      </Text>
      <InviteButtonsHookForm options={invites} />
    </>
  );
};
