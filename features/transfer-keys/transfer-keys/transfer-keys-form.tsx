import { FC, memo } from 'react';
import { TransferKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { CleanupInfoNote } from './controls/cleanup-info-note';
import { SubmitButton } from './controls/submit-button';
import { FormLoading } from './form-loading';
import { TransferKeysFormInfo } from './transfer-keys-form-info';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const TransferKeysForm: FC = memo(() => {
  return (
    <TransferKeysFormProvider>
      <FormBlock>
        <FormLoading>
          <FormControllerStyled>
            <KeysSelector />
            <CleanupInfoNote />
            <SubmitButton />
          </FormControllerStyled>
          <TransferKeysFormInfo />
        </FormLoading>
      </FormBlock>
    </TransferKeysFormProvider>
  );
});
