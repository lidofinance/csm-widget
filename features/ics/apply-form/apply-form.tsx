import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
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
      <FormBlock $gap="xxl">
        <FormLoader>
          <Form>
            <MainAddress />
            <AdditionalAddresses />
            <SocialProof />
            <SubmitButton />
          </Form>
        </FormLoader>
      </FormBlock>
    </ApplyFormProvider>
  </ApplyDataProvider>
));
