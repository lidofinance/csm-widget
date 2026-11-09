import { FormLayout } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, memo } from 'react';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import {
  DelayedPenaltyReportDataProvider,
  DelayedPenaltyReportFormProvider,
} from './context';
import { DelayedPenaltyReportAside } from './delayed-penalty-report-aside';
import { DelayedPenaltyReportFields } from './delayed-penalty-report-fields';

export const DelayedPenaltyReportForm: FC<{ module?: MODULE_NAME }> = memo(
  ({ module }) => {
    return (
      <AppFormUi>
        <DelayedPenaltyReportDataProvider module={module}>
          <DelayedPenaltyReportFormProvider module={module}>
            <FormPage>
              <FormReady>
                <Form data-testid="delayedPenaltyReportForm">
                  <FormLayout aside={<DelayedPenaltyReportAside />}>
                    <DelayedPenaltyReportFields />
                  </FormLayout>
                </Form>
              </FormReady>
            </FormPage>
          </DelayedPenaltyReportFormProvider>
        </DelayedPenaltyReportDataProvider>
      </AppFormUi>
    );
  },
);
