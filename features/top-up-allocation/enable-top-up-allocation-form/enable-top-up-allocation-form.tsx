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
import { AppFormUi } from 'shared/hook-form/form-ui';
import {
  EnableTopUpAllocationDataProvider,
  EnableTopUpAllocationFormProvider,
} from './context';

export const EnableTopUpAllocationForm: FC = memo(() => (
  <AppFormUi>
    <EnableTopUpAllocationDataProvider>
      <EnableTopUpAllocationFormProvider>
        <FormPage>
          <FormReady>
            <Form data-testid="enableTopUpAllocationForm">
              <FormCard title="Specify Node Operator">
                <TextField name="nodeOperatorId" label="Node Operator ID" />
                <GasCostList />
                <SubmitButton>Enable top-up allocation</SubmitButton>
              </FormCard>
            </Form>
          </FormReady>
        </FormPage>
      </EnableTopUpAllocationFormProvider>
    </EnableTopUpAllocationDataProvider>
  </AppFormUi>
));
