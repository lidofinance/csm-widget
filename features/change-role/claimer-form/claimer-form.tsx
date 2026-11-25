import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { ClaimerFormGate } from './claimer-form-gate';
import { ClaimerDataProvider, ClaimerFormProvider } from './context';

export const ClaimerForm: FC = memo(() => {
  const faq = useFaq('ROLES');

  return (
    <ClaimerDataProvider>
      <ClaimerFormProvider>
        <FormPage>
          <FormReady>
            <ClaimerFormGate />
          </FormReady>
          <Faq items={faq} />
        </FormPage>
      </ClaimerFormProvider>
    </ClaimerDataProvider>
  );
});
