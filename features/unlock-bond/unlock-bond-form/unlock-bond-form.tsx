import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { UnlockBondDataProvider, UnlockBondFormProvider } from './context';
import { CompensatingAmount } from './controls/compensating-amount';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { UnlockBondFormInfo } from './unlock-bond-form-info';
import { UnlockBondFormLoader } from './unlock-bond-form-loader';

export const UnlockBondForm: FC = memo(() => {
  return (
    <UnlockBondDataProvider>
      <UnlockBondFormProvider>
        <FormBlock>
          <UnlockBondFormLoader>
            <Form>
              <Info />
              <CompensatingAmount />
              <SubmitButton />
            </Form>
            <UnlockBondFormInfo />
          </UnlockBondFormLoader>
        </FormBlock>
      </UnlockBondFormProvider>
    </UnlockBondDataProvider>
  );
});
