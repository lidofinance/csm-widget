import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { Form } from 'shared/hook-form/form-controller';
import s from '../shared/styles.module.css';
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
        <Form className={s.formCardStack}>{cards}</Form>
      ) : (
        cards
      )}
    </Stack>
  );
};
