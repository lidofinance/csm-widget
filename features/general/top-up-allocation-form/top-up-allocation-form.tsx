import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import {
  TopUpAllocationDataProvider,
  TopUpAllocationFormProvider,
} from './context';
import { TopUpAllocationToggle } from './controls/top-up-allocation-toggle';

export const TopUpAllocationForm: FC = memo(() => {
  return (
    <TopUpAllocationDataProvider>
      <TopUpAllocationFormProvider>
        <FormBlock>
          <FormLoader>
            <Form>
              <TopUpAllocationToggle />
            </Form>
          </FormLoader>
        </FormBlock>
      </TopUpAllocationFormProvider>
    </TopUpAllocationDataProvider>
  );
});
