import { FC, memo } from 'react';

import { AddKeysFormProvider } from './context';

import { AddKeysFormInfo } from './add-keys-form-info';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { AddKeysBlock, FormControllerStyled } from './styles';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysFormProvider>
      <AddKeysBlock>
        <FormControllerStyled>
          <TokenSelect />
          <KeysInput />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddKeysFormInfo />
      </AddKeysBlock>
    </AddKeysFormProvider>
  );
});
