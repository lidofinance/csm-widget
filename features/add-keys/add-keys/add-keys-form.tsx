import { FC, memo } from 'react';

import { AddKeysDataProvider, AddKeysFormProvider } from './context';

import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AmountInput } from './controls/amount-input';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const AddKeysForm: FC = memo(() => {
  return (
    <AddKeysDataProvider>
      <AddKeysFormProvider>
        <FormBlock data-testid="submitKeysForm">
          <FormLoader>
            <Form>
              <TokenSelect />
              <KeysInput />
              <AmountInput />
              <KeysConfirm />
              <SubmitButton />
            </Form>
            <AddKeysFormInfo />
          </FormLoader>
        </FormBlock>
        <DepositQueue />
      </AddKeysFormProvider>
    </AddKeysDataProvider>
  );
});
