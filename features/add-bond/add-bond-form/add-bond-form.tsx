import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { AddBondFormInfo } from './add-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
      <FormBlock>
        <FormControllerStyled>
          <Info />
          <TokenSelect />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddBondFormInfo />
      </FormBlock>
    </AddBondFormProvider>
  );
});
