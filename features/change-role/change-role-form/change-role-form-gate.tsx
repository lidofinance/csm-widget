import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { FormCardStackStyle } from '../shared/styles';
import { shouldRenderChangeRoleForm } from './change-role-state';
import { useChangeRoleFlow, useChangeRoleFormData } from './context';
import { AddressFormCard } from './controls/address-form-card';
import { CurrentAddressCard } from './controls/current-address-card';
import { PendingChangeCard } from './controls/pending-change-card';

export const ChangeRoleFormGate: FC = () => {
  const flow = useChangeRoleFlow();
  const { invite } = useChangeRoleFormData(true);

  const cards = (
    <>
      <PendingChangeCard />
      <CurrentAddressCard />
      {flow.action !== 'view' && <AddressFormCard />}
    </>
  );

  return (
    <Stack gap={8} data-testid="changeRoleForm">
      {shouldRenderChangeRoleForm({
        action: flow.action,
        hasInvite: !!invite,
      }) ? (
        <FormCardStackStyle>{cards}</FormCardStackStyle>
      ) : (
        cards
      )}
    </Stack>
  );
};
