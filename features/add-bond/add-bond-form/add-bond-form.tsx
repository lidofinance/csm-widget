import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { AddBondFormInfo } from './add-bond-form-info';
import { FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { Block } from '@lidofinance/lido-ui';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
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
