import { FC, memo } from 'react';

import { AddKeysFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AddKeysBlock, FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { AddKeysHat } from './hat';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysFormProvider>
      <AddKeysHat />
      <AddKeysBlock>
        <FormControllerStyled>
          <KeysInput />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <AddKeysFormInfo />
      </AddKeysBlock>
    </AddKeysFormProvider>
  );
});
