import { Stack, FormLayout } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { PenaltyHistory } from '../penalty-history';
import { UnlockBondDataProvider, UnlockBondFormProvider } from './context';
import { LockedBondNotice, LockedBondSummary } from './controls/locked-bond';
import { UnlockBondAside } from './unlock-bond-aside';
import { UnlockBondFormGate } from './unlock-bond-form-gate';

export const UnlockBondForm: FC = memo(() => {
  const faq = useFaq('LOCKED');

  return (
    <AppFormUi>
      <UnlockBondDataProvider>
        <UnlockBondFormProvider>
          <FormPage below={<PenaltyHistory />} faq={<Faq items={faq} />}>
            <FormReady>
              <UnlockBondFormGate>
                <Form data-testid="unlockBondForm">
                  <FormLayout aside={<UnlockBondAside />}>
                    <Stack direction="column" gap={24}>
                      <LockedBondSummary />
                      <LockedBondNotice />
                    </Stack>
                  </FormLayout>
                </Form>
              </UnlockBondFormGate>
            </FormReady>
          </FormPage>
        </UnlockBondFormProvider>
      </UnlockBondDataProvider>
    </AppFormUi>
  );
});
