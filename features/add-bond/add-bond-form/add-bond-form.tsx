import { FC, memo } from 'react';

import { AddBondFormProvider } from './context';

import { FormBlock } from 'shared/components';
import {
  BaseFormLoader,
  FormControllerStyled,
} from 'shared/hook-form/form-controller';
import { AddBondFormInfo } from './add-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondFormProvider>
      <FormBlock>
        <BaseFormLoader>
          <FormControllerStyled>
            <Info />
            <TokenSelect />
            <AmountInput />
            <SubmitButton />
          </FormControllerStyled>
          <AddBondFormInfo />
        </BaseFormLoader>
      </FormBlock>
    </AddBondFormProvider>
  );
});
