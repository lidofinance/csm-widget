import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { SubmitKeysButton } from './controls/submit-keys-button';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { SubmitKeysBlock, FormControllerStyled } from './styles';
import { AmountInputGroup } from './controls/amount-input-group';
import { KeysInput } from './controls/keys-input';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <SubmitKeysBlock data-testid="submitKeysForm">
        <FormControllerStyled>
          <KeysInput />
          <AmountInputGroup />
          <SubmitKeysButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </SubmitKeysBlock>
    </SubmitKeysFormProvider>
  );
});
