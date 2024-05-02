import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { SubmitKeysButton } from './controls/submit-keys-button';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { SubmitKeysBlock, FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitKeysHat } from './hat';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <SubmitKeysHat />
      <SubmitKeysBlock data-testid="submitKeysForm">
        <FormControllerStyled>
          <KeysInput />
          <AmountInput />
          <SubmitKeysButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </SubmitKeysBlock>
    </SubmitKeysFormProvider>
  );
});
