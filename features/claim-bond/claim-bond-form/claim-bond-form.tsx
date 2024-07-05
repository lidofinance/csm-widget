import { FC, memo } from 'react';

import { ClaimBondFormProvider } from './context';

import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { ClaimBondHat } from './hat';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondFormProvider>
      <ClaimBondHat />
      <FormBlock>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimBondFormInfo />
      </FormBlock>
    </ClaimBondFormProvider>
  );
});
