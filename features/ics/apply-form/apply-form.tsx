import { Divider } from '@lidofinance/lido-app-ui';
import { FC, memo } from 'react';
import { FormCard, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { ApplyDataProvider, ApplyFormProvider } from './context';
import {
  AdditionalAddresses,
  MainAddress,
  SocialProof,
  SubmitButton,
} from './controls';

export const ApplyForm: FC = memo(() => (
  <ApplyDataProvider>
    <ApplyFormProvider>
      <FormReady>
        <Form data-testid="applyForm">
          <FormCard>
            <MainAddress />
            <Divider />
            <AdditionalAddresses />
            <Divider />
            <SocialProof />
            <SubmitButton />
          </FormCard>
        </Form>
      </FormReady>
    </ApplyFormProvider>
  </ApplyDataProvider>
));
