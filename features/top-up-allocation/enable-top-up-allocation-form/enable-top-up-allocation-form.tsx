import { FC, memo } from 'react';
import {
  FormCard,
  FormPage,
  FormReady,
  GasCostList,
  SubmitButton,
} from 'shared/form-page';
import { TextField } from 'shared/hook-form/fields';
import { Form } from 'shared/hook-form/form-controller';
import {
  EnableTopUpAllocationDataProvider,
  EnableTopUpAllocationFormProvider,
} from './context';

export const EnableTopUpAllocationForm: FC = memo(() => (
  <EnableTopUpAllocationDataProvider>
    <EnableTopUpAllocationFormProvider>
      <FormPage>
        <FormReady>
          <Form data-testid="enableTopUpAllocationForm">
            <FormCard title="Specify Node Operator">
              <TextField name="nodeOperatorId" label="Node Operator ID" />
              <SubmitButton>Enable top-up allocation</SubmitButton>
              <GasCostList />
            </FormCard>
          </Form>
        </FormReady>
      </FormPage>
    </EnableTopUpAllocationFormProvider>
  </EnableTopUpAllocationDataProvider>
));
