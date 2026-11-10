import { Divider } from '@lidofinance/lido-app-ui';
import { FC, memo } from 'react';
import { FormCard, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { ApplyDataProvider, ApplyFormProvider } from './context';
import {
  ClusterMembers,
  Confirmations,
  MainAddress,
  SocialProof,
  SubmitButton,
} from './controls';

export const ApplyForm: FC = memo(() => (
  <AppFormUi>
    <ApplyDataProvider>
      <ApplyFormProvider>
        <FormReady>
          <Form data-testid="applyForm">
            <FormCard>
              <MainAddress />
              <Divider />
              <SocialProof />
              <Divider />
              <ClusterMembers />
              <Confirmations />
              <SubmitButton />
            </FormCard>
          </Form>
        </FormReady>
      </ApplyFormProvider>
    </ApplyDataProvider>
  </AppFormUi>
));
