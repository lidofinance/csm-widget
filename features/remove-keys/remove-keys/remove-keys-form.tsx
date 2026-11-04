import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { DeleteKeysLayout, DeleteKeysSwitcherRoutes } from 'shared/navigate';
import { RemoveKeysDataProvider, RemoveKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { RemoveKeysAside } from './remove-keys-aside';
import { RemoveKeysFormGate } from './remove-keys-form-gate';
import { REMOVE_KEYS_FORM_TEST_ID } from './remove-keys-state';

export const RemoveKeysForm: FC = memo(() => {
  const faq = useFaq('KEYS');

  return (
    <AppFormUi>
      <RemoveKeysDataProvider>
        <RemoveKeysFormProvider>
          <FormPage faq={<Faq items={faq} />}>
            <FormReady>
              <RemoveKeysFormGate>
                <Form data-testid={REMOVE_KEYS_FORM_TEST_ID}>
                  <DeleteKeysLayout
                    active={DeleteKeysSwitcherRoutes.REMOVE}
                    aside={<RemoveKeysAside />}
                  >
                    <KeysSelector />
                  </DeleteKeysLayout>
                </Form>
              </RemoveKeysFormGate>
            </FormReady>
          </FormPage>
        </RemoveKeysFormProvider>
      </RemoveKeysDataProvider>
    </AppFormUi>
  );
});
