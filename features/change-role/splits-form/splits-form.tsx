import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { SplitsDataProvider, SplitsFormProvider } from './context';
import { SplitsFormGate } from './splits-form-gate';

export const SplitsForm: FC = memo(() => {
  const faq = useFaq('ROLES');

  return (
    <SplitsDataProvider>
      <SplitsFormProvider>
        <FormPage>
          <FormReady>
            <SplitsFormGate />
          </FormReady>
          <Faq items={faq} />
        </FormPage>
      </SplitsFormProvider>
    </SplitsDataProvider>
  );
});
