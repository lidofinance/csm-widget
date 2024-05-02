import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { AddBondFormInfo } from './add-bond-form-info';
import { FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { Block } from '@lidofinance/lido-ui';
import { AddBondHat } from './hat';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
      <AddBondHat />
      <Block>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddBondFormInfo />
      </Block>
    </AddBondFormProvider>
  );
});
