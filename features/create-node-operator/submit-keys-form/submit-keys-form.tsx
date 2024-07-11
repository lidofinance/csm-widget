import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { useModifyContext } from 'providers/modify-provider';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { AddressesInputs } from './controls/addresses-inputs';
import { AmountInput } from './controls/amount-input';
import { KeysInput } from './controls/keys-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormInfo } from './submit-keys-form-info';

export const SubmitKeysForm: FC = memo(() => {
  const { customAddresses } = useModifyContext();

  return (
    <SubmitKeysFormProvider>
      <FormBlock>
        <FormControllerStyled>
          <TokenSelect />
          <KeysInput />
          <AmountInput />
          {customAddresses && <AddressesInputs />}
          <SubmitButton />
        </FormControllerStyled>
        <SubmitKeysFormInfo />
      </FormBlock>
    </SubmitKeysFormProvider>
  );
});
