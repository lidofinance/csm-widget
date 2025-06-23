import { FC, memo } from 'react';

import { AddKeysFormProvider } from './context';

import { FormBlock } from 'shared/components';
import {
  BaseFormLoader,
  FormControllerStyled,
} from 'shared/hook-form/form-controller';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { KeysConfirm } from './controls/keys-confirm';
import { DepositQueue } from 'features/view-keys/deposit-queue';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysFormProvider>
      <FormBlock data-testid="submitKeysForm">
        <BaseFormLoader>
          <FormControllerStyled>
            <TokenSelect />
            <KeysInput />
            <AmountInput />
            <KeysConfirm />
            <SubmitButton />
          </FormControllerStyled>
          <AddKeysFormInfo />
        </BaseFormLoader>
      </FormBlock>
      <DepositQueue />
    </AddKeysFormProvider>
  );
});
