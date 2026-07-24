import { FC, memo } from 'react';

import {
  DelayedPenaltyCancelDataProvider,
  DelayedPenaltyCancelFormProvider,
} from './context';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { AmountInput } from './controls/amount-input';
import { NodeOperatorInput } from './controls/node-operator-input';
import { SubmitButton } from './controls/submit-button';

export const DelayedPenaltyCancelForm: FC = memo(() => {
  return (
    <DelayedPenaltyCancelDataProvider>
      <DelayedPenaltyCancelFormProvider>
        <FormBlock>
          <FormLoader>
            <Form>
              <NodeOperatorInput />
              <AmountInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </DelayedPenaltyCancelFormProvider>
    </DelayedPenaltyCancelDataProvider>
  );
});
