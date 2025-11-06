import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { SubmitKeysDataProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { CustomAddressesSection } from './controls/custom-addresses-section';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { ReferrerInput } from './controls/referrer-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { DepositQueue } from 'features/view-keys/deposit-queue';
import { HeaderOperatorTypeButton } from './header-operator-type-button';

export const SubmitKeysForm: FC = memo(() => (
  <SubmitKeysDataProvider>
    <SubmitKeysFormProvider>
      <FormBlock data-testid="submitKeysForm">
        <FormLoader>
          <HeaderOperatorTypeButton />
          <Form>
            <TokenSelect />
            <KeysInput />
            <AmountInput />
            <KeysConfirm />
            <CustomAddressesSection />
            <ReferrerInput />
            <SubmitButton />
          </Form>
          <SubmitKeysFormInfo />
        </FormLoader>
      </FormBlock>
      <DepositQueue />
    </SubmitKeysFormProvider>
  </SubmitKeysDataProvider>
));
