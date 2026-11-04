import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { DeleteKeysLayout, DeleteKeysSwitcherRoutes } from 'shared/navigate';
import { EjectKeysDataProvider, EjectKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { EjectKeysAside } from './eject-keys-aside';
import { EjectKeysFormGate } from './eject-keys-form-gate';
import { EJECT_KEYS_FORM_TEST_ID } from './eject-keys-state';

export const EjectKeysForm: FC = memo(() => {
  const faq = useFaq('KEYS');

  return (
    <AppFormUi>
      <EjectKeysDataProvider>
        <EjectKeysFormProvider>
          <FormPage faq={<Faq items={faq} />}>
            <FormReady>
              <EjectKeysFormGate>
                <Form data-testid={EJECT_KEYS_FORM_TEST_ID}>
                  <DeleteKeysLayout
                    active={DeleteKeysSwitcherRoutes.EJECT}
                    aside={<EjectKeysAside />}
                  >
                    <KeysSelector />
                  </DeleteKeysLayout>
                </Form>
              </EjectKeysFormGate>
            </FormReady>
          </FormPage>
        </EjectKeysFormProvider>
      </EjectKeysDataProvider>
    </AppFormUi>
  );
});
