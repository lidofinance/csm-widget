import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { FormControllerStyled, SubmitKeysBlock } from './styles';
import { SubmitKeysFormInfo } from './submit-keys-form-info';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <SubmitKeysBlock data-testid="submitKeysForm">
        <FormControllerStyled>
          <TokenSelect />
          <KeysInput />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </SubmitKeysBlock>
    </SubmitKeysFormProvider>
  );
});
