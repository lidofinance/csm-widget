import { FC, memo } from 'react';

import { AddKeysFormProvider } from './context';

import { AddKeysButton } from './controls/add-keys-button';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AddKeysBlock, FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysFormProvider>
      <AddKeysBlock>
        <FormControllerStyled>
          <KeysInput />
          <AmountInput />
          <AddKeysButton />
        </FormControllerStyled>
        <AddKeysFormInfo />
      </AddKeysBlock>
    </AddKeysFormProvider>
  );
});
