import { FC, memo } from 'react';

import { ClaimBondFormProvider } from './context';

import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { ClaimBondHat } from './hat';
import { ClaimBondBlock, FormControllerStyled } from './styles';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondFormProvider>
      <ClaimBondHat />
      <ClaimBondBlock>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimBondFormInfo />
      </ClaimBondBlock>
    </ClaimBondFormProvider>
  );
});
