import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { AddBondFormInfo } from './add-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { AddBondHat } from './hat';
import { AddBondBlock, FormControllerStyled } from './styles';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
      <AddBondHat />
      <AddBondBlock>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddBondFormInfo />
      </AddBondBlock>
    </AddBondFormProvider>
  );
});
