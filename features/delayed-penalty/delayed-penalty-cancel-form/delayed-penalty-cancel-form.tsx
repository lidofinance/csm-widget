import { FormLayout } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, memo } from 'react';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { LockedSection } from '../locked-section';
import {
  DelayedPenaltyCancelDataProvider,
  DelayedPenaltyCancelFormProvider,
} from './context';
import { DelayedPenaltyCancelAside } from './delayed-penalty-cancel-aside';
import { DelayedPenaltyCancelFields } from './delayed-penalty-cancel-fields';

export const DelayedPenaltyCancelForm: FC<{ module?: MODULE_NAME }> = memo(
  ({ module }) => {
    return (
      <DelayedPenaltyCancelDataProvider module={module}>
        <DelayedPenaltyCancelFormProvider module={module}>
          <FormPage below={<LockedSection module={module} />}>
            <FormReady>
              <Form data-testid="delayedPenaltyCancelForm">
                <FormLayout aside={<DelayedPenaltyCancelAside />}>
                  <DelayedPenaltyCancelFields />
                </FormLayout>
              </Form>
            </FormReady>
          </FormPage>
        </DelayedPenaltyCancelFormProvider>
      </DelayedPenaltyCancelDataProvider>
    );
  },
);
