import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { SubmitKeysButton } from './controls/submit-keys-button';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { SubmitKeysBlock, FormControllerStyled } from './styles';
import { AmountInputGroup } from './controls/amount-input-group';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <SubmitKeysBlock data-testid="submitKeysForm">
        <FormControllerStyled>
          <AmountInputGroup />
          <SubmitKeysButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </SubmitKeysBlock>
    </SubmitKeysFormProvider>
  );
});
