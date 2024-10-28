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

export const SubmitKeysForm: FC = memo(() => {
  const { referrer } = useModifyContext();

  return (
    <SubmitKeysFormProvider>
      <FormBlock>
        <BaseFormLoader>
          <FormControllerStyled>
            <TokenSelect />
            <KeysInput />
            <AmountInput />
            <CustomAddressesSection />
            {referrer && <ReferrerInput />}
            <SubmitButton />
          </FormControllerStyled>
          <SubmitKeysFormInfo />
        </BaseFormLoader>
      </FormBlock>
    </SubmitKeysFormProvider>
  );
});
