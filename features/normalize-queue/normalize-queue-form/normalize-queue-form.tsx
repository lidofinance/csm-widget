import { FC, memo } from 'react';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { FormLayout } from 'shared/ui';
import {
  NormalizeQueueDataProvider,
  NormalizeQueueFormProvider,
} from './context';
import { UnqueuedNotice } from './controls/unqueued-notice';
import { NormalizeQueueAside } from './normalize-queue-aside';
import { NormalizeQueueFormGate } from './normalize-queue-form-gate';
import { NORMALIZE_QUEUE_FORM_TEST_ID } from './normalize-queue-state';

export const NormalizeQueueForm: FC = memo(() => (
  <AppFormUi>
    <NormalizeQueueDataProvider>
      <NormalizeQueueFormProvider>
        <FormPage>
          <FormReady>
            <NormalizeQueueFormGate>
              <Form data-testid={NORMALIZE_QUEUE_FORM_TEST_ID}>
                <FormLayout aside={<NormalizeQueueAside />}>
                  <UnqueuedNotice />
                </FormLayout>
              </Form>
            </NormalizeQueueFormGate>
          </FormReady>
        </FormPage>
      </NormalizeQueueFormProvider>
    </NormalizeQueueDataProvider>
  </AppFormUi>
));
