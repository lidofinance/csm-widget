import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import {
  EnableTopUpAllocationDataProvider,
  EnableTopUpAllocationFormProvider,
} from './context';
import { NodeOperatorInput } from './controls/node-operator-input';
import { SubmitButton } from './controls/submit-button';

export const EnableTopUpAllocationForm: FC = memo(() => {
  return (
    <EnableTopUpAllocationDataProvider>
      <EnableTopUpAllocationFormProvider>
        <FormBlock data-testid="enableTopUpAllocationForm">
          <FormLoader>
            <Form>
              <NodeOperatorInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </EnableTopUpAllocationFormProvider>
    </EnableTopUpAllocationDataProvider>
  );
});
