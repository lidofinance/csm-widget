import { Stack, FormLayout } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { useFaq } from 'faq';
import { DepositQueue } from 'features/view-keys/deposit-queue';
import { FC, memo, useRef } from 'react';
import { Faq } from 'shared/components';
import {
  FormPage,
  FormReady,
  SubmitAside,
  WizardStepper,
} from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import {
  CreatableOperatorType,
  getCreateFlow,
  useCreateOptions,
} from 'shared/hooks';
import { useCreateSuccess } from '../create-success';
import { getCsmCreateSteps } from '../csm-create-steps';
import { OtherModuleBanner } from '../other-module-banner';
import { ShareLimitBanner } from '../share-limit-banner';
import { SubmitKeysDataProvider, SubmitKeysFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { CreateTypeHeader } from './controls/create-type-header';
import { CustomAddressesSection } from './controls/custom-addresses-section';
import { DkgFilesSection } from './controls/dkg-files-section';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysInput } from './controls/keys-input';
import { KeysLimitWarning } from './controls/keys-limit-warning';
import { ReferrerInput } from './controls/referrer-input';
import { CreateSubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SubmitKeysFormGate } from './submit-keys-form-gate';
import { SubmitKeysFormInfo } from './submit-keys-form-info';
import { CsmCreateSuccess } from './success';

type Props = { type: CreatableOperatorType };

const SubmitKeysPage: FC<Props> = ({ type }) => {
  // The module being created, not the active operator's: /create has none to fall back on
  const targetModule = OPERATOR_TYPE_INFO[type].module;
  const { created } = useCreateSuccess();
  const liveHasChoose = getCreateFlow(useCreateOptions()).willChoose;
  // Options shrink after create; keep the pre-success step list
  const hasChooseRef = useRef(liveHasChoose);
  if (!created) hasChooseRef.current = liveHasChoose;
  const { steps, current } = getCsmCreateSteps('upload', hasChooseRef.current);
  const faq = useFaq('KEYS', targetModule);

  return (
    <FormPage
      steps={
        <>
          <WizardStepper steps={steps} current={current} done={!!created} />
          {!created && <CreateTypeHeader type={type} />}
        </>
      }
      notices={
        <>
          <ShareLimitBanner />
          <OtherModuleBanner module={targetModule} />
          <KeysLimitWarning />
        </>
      }
      below={<DepositQueue module={targetModule} />}
      faq={created ? undefined : <Faq items={faq} />}
      done={!!created}
    >
      {created ? (
        <CsmCreateSuccess created={created} />
      ) : (
        <FormReady>
          <SubmitKeysFormGate>
            <Form data-testid="submitKeysForm">
              <FormLayout
                aside={
                  <SubmitAside
                    confirm={<KeysConfirm />}
                    rows={<SubmitKeysFormInfo />}
                  >
                    <CreateSubmitButton />
                  </SubmitAside>
                }
              >
                <Stack direction="column" gap={32} align="stretch">
                  <TokenSelect />
                  <Stack direction="column" gap={12} align="stretch">
                    <KeysInput />
                    <AmountInput />
                  </Stack>
                  <DkgFilesSection />
                  <Stack direction="column" gap={16} align="stretch">
                    <CustomAddressesSection />
                    <ReferrerInput />
                  </Stack>
                </Stack>
              </FormLayout>
            </Form>
          </SubmitKeysFormGate>
        </FormReady>
      )}
    </FormPage>
  );
};

export const SubmitKeysForm: FC<Props> = memo(({ type }: Props) => (
  <AppFormUi>
    <SubmitKeysDataProvider type={type}>
      <SubmitKeysFormProvider>
        <SubmitKeysPage type={type} />
      </SubmitKeysFormProvider>
    </SubmitKeysDataProvider>
  </AppFormUi>
));
