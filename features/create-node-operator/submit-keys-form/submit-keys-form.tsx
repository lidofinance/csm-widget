import { FC, memo } from 'react';

import { SubmitKeysFormProvider } from './context';

import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { SubmitKeysDataProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { CreateTypeHeader } from './controls/create-type-header';
import { CustomAddressesSection } from './controls/custom-addresses-section';
import { DkgFilesSection } from './controls/dkg-files-section';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { KeysLimitWarning } from './controls/keys-limit-warning';
import { ReferrerInput } from './controls/referrer-input';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { useCreateType } from 'providers/create-type-provider';

export const SubmitKeysForm: FC = memo(() => {
  // The graph must read the module being created, not the active operator's
  // module — on /create there is no active operator to fall back on.
  const { module: targetModule } = useCreateType();

  return (
    <SubmitKeysDataProvider>
      <SubmitKeysFormProvider>
        <FormBlock data-testid="submitKeysForm">
          <FormLoader>
            <Form>
              <CreateTypeHeader />
              <TokenSelect />
              <KeysLimitWarning />
              <KeysInput />
              <AmountInput />
              <DkgFilesSection />
              <CustomAddressesSection />
              <ReferrerInput />
              <KeysConfirm />
              <SubmitButton />
            </Form>
            <SubmitKeysFormInfo />
          </FormLoader>
        </FormBlock>
        <DepositQueue module={targetModule} />
      </SubmitKeysFormProvider>
    </SubmitKeysDataProvider>
  );
});
