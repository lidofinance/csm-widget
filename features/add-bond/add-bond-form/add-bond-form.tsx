import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { AddBondFormInfo } from './add-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { AddBondBlock, FormControllerStyled } from './styles';
import { TokenSelect } from './controls/token-select';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
      <AddBondBlock>
        <FormControllerStyled>
          <TokenSelect />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddBondFormInfo />
      </AddBondBlock>
    </AddBondFormProvider>
  );
});
