import { FC, memo } from 'react';
import {
  DeleteKeysFormSkeleton,
  DeleteKeysLayout,
} from 'features/delete-keys/delete-keys-layout';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { EjectKeysDataProvider, EjectKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { EjectKeysAside } from './eject-keys-aside';
import { EjectKeysFormGate } from './eject-keys-form-gate';
import { EJECT_KEYS_FORM_TEST_ID } from './eject-keys-state';

export const EjectKeysForm: FC = memo(() => (
  <AppFormUi>
    <EjectKeysDataProvider>
      <EjectKeysFormProvider>
        <FormPage>
          <FormReady skeleton={<DeleteKeysFormSkeleton />}>
            <EjectKeysFormGate>
              <Form data-testid={EJECT_KEYS_FORM_TEST_ID}>
                <DeleteKeysLayout focusCards aside={<EjectKeysAside />}>
                  <KeysSelector />
                </DeleteKeysLayout>
              </Form>
            </EjectKeysFormGate>
          </FormReady>
        </FormPage>
      </EjectKeysFormProvider>
    </EjectKeysDataProvider>
  </AppFormUi>
));
