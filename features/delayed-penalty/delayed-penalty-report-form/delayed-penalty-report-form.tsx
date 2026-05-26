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

export const DelayedPenaltyReportForm: FC = memo(() => {
  return (
    <DelayedPenaltyReportDataProvider>
      <DelayedPenaltyReportFormProvider>
        <FormBlock>
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
});
