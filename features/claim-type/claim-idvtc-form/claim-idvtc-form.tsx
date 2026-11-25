import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimTypeSuccessProvider, useClaimTypeSuccess } from '../shared';
import { ClaimIdvtcCards, ClaimIdvtcSubmitButton } from './claim-idvtc-cards';
import { ClaimIdvtcFormGate } from './claim-idvtc-form-gate';
import { ClaimIdvtcSuccess } from './claim-idvtc-success';
import { ClaimIdvtcDataProvider, ClaimIdvtcFormProvider } from './context';
import s from './styles.module.css';

const ClaimIdvtcContent: FC = () => {
  const { justClaimed } = useClaimTypeSuccess();
  const faq = useFaq('OPERATOR_TYPE');

  return (
    <FormPage done={justClaimed}>
      {justClaimed ? (
        <div className={s.narrow}>
          <ClaimIdvtcSuccess />
        </div>
      ) : (
        <FormReady>
          <ClaimIdvtcFormGate>
            <Form data-testid="claimIdvtcForm">
              <ClaimIdvtcCards cta={<ClaimIdvtcSubmitButton />} />
            </Form>
          </ClaimIdvtcFormGate>
        </FormReady>
      )}
      {!justClaimed && <Faq items={faq} />}
    </FormPage>
  );
};

export const ClaimIdvtcForm: FC = memo(() => (
  <ClaimTypeSuccessProvider>
    <ClaimIdvtcDataProvider>
      <ClaimIdvtcFormProvider>
        <ClaimIdvtcContent />
      </ClaimIdvtcFormProvider>
    </ClaimIdvtcDataProvider>
  </ClaimTypeSuccessProvider>
));
