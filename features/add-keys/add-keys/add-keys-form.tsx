import { FC, memo } from 'react';

import { AddKeysDataProvider, AddKeysFormProvider } from './context';

import { DkgFilesField } from 'features/idvtc/dkg/components/dkg-files-field';
import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { useShowRule } from 'shared/hooks';
import { Gate } from 'shared/navigate';
import { AddKeysFormInfo } from './add-keys-form-info';
import { AddKeysFormLoader } from './add-keys-form-loader';
import { AmountInput } from './controls/amount-input';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { KeysLimitWarning } from './controls/keys-limit-warning';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const AddKeysForm: FC = memo(() => {
  const check = useShowRule();

  return (
    <AddKeysDataProvider>
      <AddKeysFormProvider>
        <FormBlock data-testid="submitKeysForm">
          <AddKeysFormLoader>
            <Form>
              <TokenSelect />
              <KeysLimitWarning />
              <KeysInput />
              <AmountInput />
              <KeysConfirm />
              {check('IS_IDVTC') && <DkgFilesField />}
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
