import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { SubmitKeysFormInfo } from './add-bond-form-info';
import { FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { Block } from '@lidofinance/lido-ui';

export const SubmitKeysForm: FC = memo(() => {
  return (
    <SubmitKeysFormProvider>
      <Block>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </Block>
    </SubmitKeysFormProvider>
  );
});
