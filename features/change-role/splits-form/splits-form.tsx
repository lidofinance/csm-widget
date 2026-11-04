import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { SplitsDataProvider, SplitsFormProvider } from './context';
import { SplitsFormGate } from './splits-form-gate';

export const SplitsForm: FC = memo(() => {
  const faq = useFaq('ROLES');

  return (
    <AppFormUi>
      <SplitsDataProvider>
        <SplitsFormProvider>
          <FormPage faq={<Faq items={faq} />}>
            <FormReady>
              <SplitsFormGate />
            </FormReady>
          </FormPage>
        </SplitsFormProvider>
      </SplitsDataProvider>
    </AppFormUi>
  );
});
