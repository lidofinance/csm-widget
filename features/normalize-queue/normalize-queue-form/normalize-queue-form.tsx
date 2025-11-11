import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import {
  NormalizeQueueDataProvider,
  NormalizeQueueFormProvider,
} from './context';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { NormalizeQueueFormInfo } from './normalize-queue-form-info';

export const NormalizeQueueForm: FC = memo(() => {
  return (
    <NormalizeQueueDataProvider>
      <NormalizeQueueFormProvider>
        <FormBlock>
          <FormLoader>
            <Form>
              <Info />
              <SubmitButton />
            </Form>
            <NormalizeQueueFormInfo />
          </FormLoader>
        </FormBlock>
      </NormalizeQueueFormProvider>
    </NormalizeQueueDataProvider>
  );
});
