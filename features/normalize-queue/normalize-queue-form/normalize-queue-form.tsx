import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import {
  NormalizeQueueDataProvider,
  NormalizeQueueFormProvider,
} from './context';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { NormalizeQueueFormInfo } from './normalize-queue-form-info';
import { NormalizeQueueFormLoader } from './normalize-queue-form-loader';

export const NormalizeQueueForm: FC = memo(() => {
  return (
    <NormalizeQueueDataProvider>
      <NormalizeQueueFormProvider>
        <FormBlock>
          <NormalizeQueueFormLoader>
            <Form>
              <Info />
              <SubmitButton />
            </Form>
            <NormalizeQueueFormInfo />
          </NormalizeQueueFormLoader>
        </FormBlock>
      </NormalizeQueueFormProvider>
    </NormalizeQueueDataProvider>
  );
});
