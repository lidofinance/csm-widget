import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { useModifyContext } from 'providers/modify-provider';
import { FormBlock } from 'shared/components';
import {
  BaseFormLoader,
  FormControllerStyled,
} from 'shared/hook-form/form-controller';
import { AmountInput } from './controls/amount-input';
import { CustomAddressesSection } from './controls/custom-addresses-section';
import { KeysInput } from './controls/keys-input';
import { ReferrerInput } from './controls/referrer-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { KeysConfirm } from './controls/keys-confirm';
import { DepositQueue } from 'features/view-keys/deposit-queue';

export const SubmitKeysForm: FC = memo(() => {
  const { referrer } = useModifyContext();

  return (
    <SubmitKeysFormProvider>
      <FormBlock data-testid="submitKeysForm">
        <BaseFormLoader>
          <FormControllerStyled>
            <TokenSelect />
            <KeysInput />
            <AmountInput />
            <KeysConfirm />
            <CustomAddressesSection />
            {referrer && <ReferrerInput />}
            <SubmitButton />
          </FormControllerStyled>
          <SubmitKeysFormInfo />
        </BaseFormLoader>
      </FormBlock>
      <DepositQueue />
    </SubmitKeysFormProvider>
  );
});
