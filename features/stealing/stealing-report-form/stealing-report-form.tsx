import { FC, memo } from 'react';

import { StealingReportFormProvider } from './context';

import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { StealingReportFormLoader } from './stealing-report-form-loader';
import { BlockhashInput } from './controls/blockhash-input';
import { NodeOperatorInput } from './controls/node-operator-input';

export const StealingReportForm: FC = memo(() => {
  return (
    <StealingReportFormProvider>
      <FormBlock>
        <StealingReportFormLoader>
          <FormControllerStyled>
            <NodeOperatorInput />
            <AmountInput />
            <BlockhashInput />
            <SubmitButton />
          </FormControllerStyled>
        </StealingReportFormLoader>
      </FormBlock>
    </StealingReportFormProvider>
  );
});
