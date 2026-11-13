import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { DeleteKeysLayout } from 'features/delete-keys/delete-keys-layout';
import { NoAccessNotice } from 'shared/form-page';
import { useEjectKeysFlow } from './context';
import {
  EJECT_KEYS_FORM_TEST_ID,
  NO_KEYS_TO_EJECT,
  NO_KEYS_TO_EJECT_NOTE,
} from './eject-keys-state';

export const EjectKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useEjectKeysFlow();

  if (flow.action === 'no-access') {
    return (
      <DeleteKeysLayout focusCards data-testid={EJECT_KEYS_FORM_TEST_ID}>
        <NoAccessNotice access={flow.access} />
      </DeleteKeysLayout>
    );
  }

  if (flow.action === 'no-keys') {
    return (
      <DeleteKeysLayout focusCards data-testid={EJECT_KEYS_FORM_TEST_ID}>
        <MessageBox icon={false} headline={NO_KEYS_TO_EJECT}>
          {NO_KEYS_TO_EJECT_NOTE}
        </MessageBox>
      </DeleteKeysLayout>
    );
  }

  return <>{children}</>;
};
