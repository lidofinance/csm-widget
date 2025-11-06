import { FC, memo } from 'react';
import {
  StealingReportDataProvider,
  StealingReportFormProvider,
} from './context';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { BlockhashInput } from './controls/blockhash-input';
import { NodeOperatorInput } from './controls/node-operator-input';

export const StealingReportForm: FC = memo(() => {
  return (
    <StealingReportDataProvider>
      <StealingReportFormProvider>
        <FormBlock>
          <FormLoader>
            <Form>
              <NodeOperatorInput />
              <AmountInput />
              <BlockhashInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </StealingReportFormProvider>
    </StealingReportDataProvider>
  );
});
