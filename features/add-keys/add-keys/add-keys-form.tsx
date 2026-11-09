import { Stack, FormLayout } from '@lidofinance/lido-app-ui';
import { useFaq } from 'faq';
import { ShareLimitBanner } from 'features/create-node-operator/share-limit-banner';
import { DkgFilesField } from 'features/idvtc/dkg/components/dkg-files-field';
import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { Gate } from 'shared/navigate';
import { AddKeysAside } from './add-keys-aside';
import { AddKeysFormGate } from './add-keys-form-gate';
import { AddKeysDataProvider, AddKeysFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { ExcessBondRow } from './controls/bond-delta';
import { KeysInput } from './controls/keys-input';
import { KeysLimitWarning } from './controls/keys-limit-warning';
import { TokenSelect } from './controls/token-select';

export const AddKeysForm: FC = memo(() => {
  const faq = useFaq('KEYS');

  return (
    <AppFormUi>
      <AddKeysDataProvider>
        <AddKeysFormProvider>
          <FormPage
            notices={
              <>
                <ShareLimitBanner />
                <KeysLimitWarning />
              </>
            }
            below={
              <Gate rule="IS_CSM_FAMILY">
                <DepositQueue />
              </Gate>
            }
            faq={<Faq items={faq} />}
          >
            <FormReady>
              <AddKeysFormGate>
                <Form data-testid="submitKeysForm">
                  <FormLayout aside={<AddKeysAside />}>
                    <Stack direction="column" gap={32}>
                      <TokenSelect />
                      <ExcessBondRow />
                      <Stack direction="column" gap={16}>
                        <KeysInput />
                        <AmountInput />
                      </Stack>
                      <Gate rule="IS_IDVTC">
                        <DkgFilesField />
                      </Gate>
                    </Stack>
                  </FormLayout>
                </Form>
              </AddKeysFormGate>
            </FormReady>
          </FormPage>
        </AddKeysFormProvider>
      </AddKeysDataProvider>
    </AppFormUi>
  );
});
