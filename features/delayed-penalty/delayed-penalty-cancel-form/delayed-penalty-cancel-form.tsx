import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, memo } from 'react';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { FormLayout } from 'shared/ui';
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
      <AppFormUi>
        <DelayedPenaltyCancelDataProvider module={module}>
          <DelayedPenaltyCancelFormProvider module={module}>
            <FormPage
              below={
                <FormUiProvider value="legacy">
                  <LockedSection module={module} />
                </FormUiProvider>
              }
            >
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
      </AppFormUi>
    );
  },
);
