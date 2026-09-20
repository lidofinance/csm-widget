import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import {
  DelayedPenaltyReportDataProvider,
  DelayedPenaltyReportFormProvider,
} from './context';
import { AmountInput } from './controls/amount-input';
import { DetailsInput } from './controls/details-input';
import { NodeOperatorInput } from './controls/node-operator-input';
import { PenaltyTypeInput } from './controls/penalty-type-input';
import { SubmitButton } from './controls/submit-button';

export const DelayedPenaltyReportForm: FC<{ module?: MODULE_NAME }> = memo(
  ({ module }) => {
    return (
      <DelayedPenaltyReportDataProvider module={module}>
        <DelayedPenaltyReportFormProvider module={module}>
          <FormBlock data-testid="delayedPenaltyReportForm">
            <FormLoader>
              <Form>
                <NodeOperatorInput />
                <AmountInput />
                <PenaltyTypeInput />
                <DetailsInput />
                <SubmitButton />
              </Form>
            </FormLoader>
          </FormBlock>
        </DelayedPenaltyReportFormProvider>
      </DelayedPenaltyReportDataProvider>
    );
  },
);
