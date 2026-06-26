import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { isModuleCSM } from 'consts';
import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { SubmitKeysDataProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { CustomAddressesSection } from './controls/custom-addresses-section';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { ReferrerInput } from './controls/referrer-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { HeaderOperatorTypeButton } from './header-operator-type-button';
import { SubmitKeysFormInfo } from './submit-keys-form-info';

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
      {isModuleCSM && <DepositQueue />}
    </SubmitKeysFormProvider>
  </SubmitKeysDataProvider>
));
