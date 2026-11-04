import { FC, memo } from 'react';
import { FormPage, FormReady } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import {
  TopUpAllocationDataProvider,
  TopUpAllocationFormProvider,
} from './context';
import { TopUpSwitch } from './controls/top-up-switch';
import { TopUpAllocationFormGate } from './top-up-allocation-form-gate';
import { TopUpCard } from './top-up-card';

export const TopUpAllocationForm: FC = memo(() => (
  <AppFormUi>
    <TopUpAllocationDataProvider>
      <TopUpAllocationFormProvider>
        <FormPage>
          <FormReady>
            <TopUpAllocationFormGate>
              <Form>
                <TopUpCard enabled>
                  <TopUpSwitch />
                </TopUpCard>
              </Form>
            </TopUpAllocationFormGate>
          </FormReady>
        </FormPage>
      </TopUpAllocationFormProvider>
    </TopUpAllocationDataProvider>
  </AppFormUi>
));
