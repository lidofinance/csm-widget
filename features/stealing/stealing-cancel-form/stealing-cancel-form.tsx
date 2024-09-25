import { FC, memo } from 'react';

import { StealingCancelFormProvider } from './context';

import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { StealingCancelFormLoader } from './stealing-cancel-form-loader';
import { NodeOperatorInput } from './controls/node-operator-input';

export const StealingCancelForm: FC = memo(() => {
  return (
    <StealingCancelFormProvider>
      <FormBlock>
        <StealingCancelFormLoader>
          <FormControllerStyled>
            <NodeOperatorInput />
            <AmountInput />
            <SubmitButton />
          </FormControllerStyled>
        </StealingCancelFormLoader>
      </FormBlock>
    </StealingCancelFormProvider>
  );
});
