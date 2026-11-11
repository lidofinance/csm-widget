import { FC, memo } from 'react';
import {
  DeleteKeysFormSkeleton,
  DeleteKeysLayout,
} from 'features/delete-keys/delete-keys-layout';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { RemoveKeysDataProvider, RemoveKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { RemoveKeysAside } from './remove-keys-aside';
import { RemoveKeysFormGate } from './remove-keys-form-gate';
import { REMOVE_KEYS_FORM_TEST_ID } from './remove-keys-state';

export const RemoveKeysForm: FC = memo(() => (
  <AppFormUi>
    <RemoveKeysDataProvider>
      <RemoveKeysFormProvider>
        <FormPage>
          <FormReady skeleton={<DeleteKeysFormSkeleton />}>
            <RemoveKeysFormGate>
              <Form data-testid={REMOVE_KEYS_FORM_TEST_ID}>
                <DeleteKeysLayout focusCards aside={<RemoveKeysAside />}>
                  <KeysSelector />
                </DeleteKeysLayout>
              </Form>
            </RemoveKeysFormGate>
          </FormReady>
        </FormPage>
      </RemoveKeysFormProvider>
    </RemoveKeysDataProvider>
  </AppFormUi>
));
