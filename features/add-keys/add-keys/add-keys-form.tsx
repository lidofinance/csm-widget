import { FC, memo } from 'react';

import { AddKeysDataProvider, AddKeysFormProvider } from './context';

import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { Gate } from 'shared/navigate';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AddKeysFormLoader } from './add-keys-form-loader';
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
          <AddKeysFormLoader>
            <Form>
              <TokenSelect />
              <KeysInput />
              <AmountInput />
              <KeysConfirm />
              <SubmitButton />
            </Form>
            <AddKeysFormInfo />
          </AddKeysFormLoader>
        </FormBlock>
        <Gate rule="IS_CSM">
          <DepositQueue />
        </Gate>
      </AddKeysFormProvider>
    </AddKeysDataProvider>
  );
});
