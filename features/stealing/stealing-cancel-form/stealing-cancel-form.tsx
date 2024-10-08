import { FC, memo } from 'react';

import { StealingCancelFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { AmountInput } from './controls/amount-input';
import { NodeOperatorInput } from './controls/node-operator-input';
import { SubmitButton } from './controls/submit-button';
import { StealingCancelFormLoader } from './stealing-cancel-form-loader';

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
