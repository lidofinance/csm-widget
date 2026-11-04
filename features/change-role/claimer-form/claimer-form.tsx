import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { ClaimerFormGate } from './claimer-form-gate';
import { ClaimerDataProvider, ClaimerFormProvider } from './context';

export const ClaimerForm: FC = memo(() => {
  const faq = useFaq('ROLES');

  return (
    <AppFormUi>
      <ClaimerDataProvider>
        <ClaimerFormProvider>
          <FormPage faq={<Faq items={faq} />}>
            <FormReady>
              <ClaimerFormGate />
            </FormReady>
          </FormPage>
        </ClaimerFormProvider>
      </ClaimerDataProvider>
    </AppFormUi>
  );
});
