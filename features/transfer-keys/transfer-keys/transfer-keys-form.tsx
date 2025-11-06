import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { TransferKeysDataProvider, TransferKeysFormProvider } from './context';
import { CleanupInfoNote } from './controls/cleanup-info-note';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { TransferKeysFormInfo } from './transfer-keys-form-info';
import { TransferKeysFormLoader } from './transfer-keys-form-loader';

export const TransferKeysForm: FC = memo(() => {
  return (
    <TransferKeysDataProvider>
      <TransferKeysFormProvider>
        <FormBlock>
          <TransferKeysFormLoader>
            <Form>
              <KeysSelector />
              <CleanupInfoNote />
              <SubmitButton />
            </Form>
            <TransferKeysFormInfo />
          </TransferKeysFormLoader>
        </FormBlock>
      </TransferKeysFormProvider>
    </TransferKeysDataProvider>
  );
});
