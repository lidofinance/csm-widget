import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { DeleteKeysLayout } from 'features/delete-keys/delete-keys-layout';
import { NoAccessNotice } from 'shared/form-page';
import { useRemoveKeysFlow } from './context';
import {
  NO_KEYS_TO_REMOVE,
  NO_KEYS_TO_REMOVE_NOTE,
  REMOVE_KEYS_FORM_TEST_ID,
} from './remove-keys-state';

export const RemoveKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useRemoveKeysFlow();

  if (flow.action === 'no-access') {
    return (
      <DeleteKeysLayout focusCards data-testid={REMOVE_KEYS_FORM_TEST_ID}>
        <NoAccessNotice access={flow.access} />
      </DeleteKeysLayout>
    );
  }

  if (flow.action === 'no-keys') {
    return (
      <DeleteKeysLayout focusCards data-testid={REMOVE_KEYS_FORM_TEST_ID}>
        <MessageBox variant="default" icon={false} headline={NO_KEYS_TO_REMOVE}>
          {NO_KEYS_TO_REMOVE_NOTE}
        </MessageBox>
      </DeleteKeysLayout>
    );
  }

  return <>{children}</>;
};
