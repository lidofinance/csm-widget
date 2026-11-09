import {
  MessageBox,
  Stack,
  TextLink,
  FormLayout,
} from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/form-page';
import { useUnlockBondFlow } from './context';
import { LockedBondNotice, LockedBondSummary } from './controls/locked-bond';

const GateLayout: FC<PropsWithChildren> = ({ children }) => (
  <FormLayout>
    <Stack direction="column" gap={24}>
      <LockedBondSummary />
      {children}
    </Stack>
  </FormLayout>
);

export const UnlockBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useUnlockBondFlow();

  if (flow.action === 'nothing') return <GateLayout />;

  if (flow.action === 'no-access') {
    return (
      <GateLayout>
        <LockedBondNotice />
        <NoAccessNotice access={flow.access} />
      </GateLayout>
    );
  }

  if (flow.action === 'insufficient-bond') {
    return (
      <GateLayout>
        <LockedBondNotice />
        <MessageBox variant="warning">
          Your bond is insufficient to compensate the locked amount. Please{' '}
          <TextLink href={PATH.BOND_ADD}>top up the bond</TextLink> first.
        </MessageBox>
      </GateLayout>
    );
  }

  return <>{children}</>;
};
