import { FormLayout } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { BondStatsCard, Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { PenaltyHistory } from '../penalty-history';
import { UnlockBondDataProvider, UnlockBondFormProvider } from './context';
import { LockedBondNotice } from './controls/locked-bond';
import { UnlockBondAside } from './unlock-bond-aside';
import { UnlockBondFormGate } from './unlock-bond-form-gate';

export const UnlockBondForm: FC = memo(() => {
  const faq = useFaq('LOCKED');

  return (
    <AppFormUi>
      <UnlockBondDataProvider>
        <UnlockBondFormProvider>
          <FormPage
            notices={<BondStatsCard />}
            below={<PenaltyHistory />}
            faq={<Faq items={faq} />}
          >
            <FormReady>
              <UnlockBondFormGate>
                <Form data-testid="unlockBondForm">
                  <FormLayout aside={<UnlockBondAside />}>
                    <LockedBondNotice />
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
