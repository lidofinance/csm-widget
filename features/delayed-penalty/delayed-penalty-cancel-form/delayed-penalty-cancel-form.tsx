import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
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

export const DelayedPenaltyCancelForm: FC<{ module?: MODULE_NAME }> = memo(
  ({ module }) => {
    return (
      <DelayedPenaltyCancelDataProvider module={module}>
        <DelayedPenaltyCancelFormProvider module={module}>
          <FormBlock data-testid="delayedPenaltyCancelForm">
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
  },
);
