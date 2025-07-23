import { FC, memo } from 'react';
import { EjectKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { FormLoading } from './form-loading';
import { EjectKeysFormInfo } from './eject-keys-form-info';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { AmountInput } from './controls/amount-input';

export const EjectKeysForm: FC = memo(() => {
  return (
    <EjectKeysFormProvider>
      <FormBlock>
        <FormLoading>
          <FormControllerStyled>
            <KeysSelector />
            <AmountInput />
            <SubmitButton />
          </FormControllerStyled>
          <EjectKeysFormInfo />
        </FormLoading>
      </FormBlock>
    </EjectKeysFormProvider>
  );
});
