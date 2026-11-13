import { useFaq } from 'faq';
import { FC, memo } from 'react';
import { Faq } from 'shared/components';
import {
  FormPage,
  FormReady,
  GasCostList,
  SubmitButton,
} from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimTypeSuccessProvider, useClaimTypeSuccess } from '../shared';
import { ClaimIcsCard } from './claim-ics-card';
import { ClaimIcsFormGate } from './claim-ics-form-gate';
import { ClaimIcsSuccess } from './claim-ics-success';
import { ClaimIcsDataProvider, ClaimIcsFormProvider } from './context';

const ClaimIcsContent: FC = () => {
  const { justClaimed } = useClaimTypeSuccess();
  const faq = useFaq('OPERATOR_TYPE');

  return (
    <FormPage
      faq={justClaimed ? undefined : <Faq items={faq} />}
      done={justClaimed}
    >
      {justClaimed ? (
        <ClaimIcsSuccess />
      ) : (
        <FormReady>
          <ClaimIcsFormGate>
            <Form data-testid="claimIcsForm">
              <ClaimIcsCard
                cta={
                  <>
                    <GasCostList />
                    <SubmitButton>Claim operator type</SubmitButton>
                  </>
                }
              />
            </Form>
          </ClaimIcsFormGate>
        </FormReady>
      )}
    </FormPage>
  );
};

export const ClaimIcsForm: FC = memo(() => (
  <ClaimTypeSuccessProvider>
    <ClaimIcsDataProvider>
      <ClaimIcsFormProvider>
        <ClaimIcsContent />
      </ClaimIcsFormProvider>
    </ClaimIcsDataProvider>
  </ClaimTypeSuccessProvider>
));
