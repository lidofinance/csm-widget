import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import {
  StealingReportDataProvider,
  StealingReportFormProvider,
} from './context';
import { AmountInput } from './controls/amount-input';
import { DetailsInput } from './controls/details-input';
import { NodeOperatorInput } from './controls/node-operator-input';
import { PenaltyTypeInput } from './controls/penalty-type-input';
import { SubmitButton } from './controls/submit-button';

export const StealingReportForm: FC = memo(() => {
  return (
    <StealingReportDataProvider>
      <StealingReportFormProvider>
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
      </StealingReportFormProvider>
    </StealingReportDataProvider>
  );
});
