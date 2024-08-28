import { FC, memo } from 'react';

import { AddKeysFormProvider } from './context';

import { AddKeysFormInfo } from './add-keys-form-info';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysFormProvider>
      <FormBlock>
        <FormControllerStyled>
          <TokenSelect />
          <KeysInput />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddKeysFormInfo />
      </FormBlock>
    </AddKeysFormProvider>
  );
});
