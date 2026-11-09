import { Stack, FormLayout } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { ClaimBondAside } from './claim-bond-aside';
import { ClaimBondFormGate } from './claim-bond-form-gate';
import { ClaimBondDataProvider, ClaimBondFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SourcesInfo } from './controls/sources-info';
import { TokenSelect } from './controls/token-select';

export const ClaimBondForm: FC = memo(() => {
  const faq = useFaq('BOND');

  return (
    <AppFormUi>
      <ClaimBondDataProvider>
        <ClaimBondFormProvider>
          <FormPage notices={<SourcesInfo />} faq={<Faq items={faq} />}>
            <FormReady>
              <ClaimBondFormGate>
                <Form data-testid="claimBondForm">
                  <FormLayout aside={<ClaimBondAside />}>
                    <Stack direction="column" gap={32}>
                      <SourceSelect />
                      <TokenSelect />
                      <AmountInput />
                    </Stack>
                  </FormLayout>
                </Form>
              </ClaimBondFormGate>
            </FormReady>
          </FormPage>
        </ClaimBondFormProvider>
      </ClaimBondDataProvider>
    </AppFormUi>
  );
});
