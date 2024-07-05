import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { FormBlock } from 'shared/components';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <FormBlock data-testid="submitKeysForm">
        <FormControllerStyled>
          <TokenSelect />
          <KeysInput />
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </FormBlock>
    </SubmitKeysFormProvider>
  );
});
