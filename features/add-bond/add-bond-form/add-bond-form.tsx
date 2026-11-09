import { Stack, FormLayout } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { BondStatsCard, Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { AddBondAside } from './add-bond-aside';
import { AddBondFormGate } from './add-bond-form-gate';
import { InsufficientBondNotice, WhyAddBondNotice } from './add-bond-notices';
import { AddBondDataProvider, AddBondFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { TokenSelect } from './controls/token-select';

export const AddBondForm: FC = memo(() => {
  const faq = useFaq('BOND');

  return (
    <AppFormUi>
      <AddBondDataProvider>
        <AddBondFormProvider>
          <FormPage
            notices={
              <>
                <BondStatsCard />
                <InsufficientBondNotice />
              </>
            }
            below={<WhyAddBondNotice />}
            faq={<Faq items={faq} />}
          >
            <FormReady>
              <AddBondFormGate>
                <Form data-testid="addBondForm">
                  <FormLayout aside={<AddBondAside />}>
                    <Stack direction="column" gap={32}>
                      <TokenSelect />
                      <AmountInput />
                    </Stack>
                  </FormLayout>
                </Form>
              </AddBondFormGate>
            </FormReady>
          </FormPage>
        </AddBondFormProvider>
      </AddBondDataProvider>
    </AppFormUi>
  );
});
