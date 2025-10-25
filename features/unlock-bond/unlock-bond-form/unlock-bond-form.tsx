import { FC, memo } from 'react';
import { UnlockBondDataProvider, UnlockBondFormProvider } from './context';
import { UnlockBondFormInfo } from './unlock-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';
import { UnlockBondFormLoader } from './unlock-bond-form-loader';

export const UnlockBondForm: FC = memo(() => {
  return (
    <UnlockBondDataProvider>
      <UnlockBondFormProvider>
        <FormBlock>
          <UnlockBondFormLoader>
            <Form>
              <Info />
              <AmountInput />
              <SubmitButton />
            </Form>
            <UnlockBondFormInfo />
          </UnlockBondFormLoader>
        </FormBlock>
      </UnlockBondFormProvider>
    </UnlockBondDataProvider>
  );
});
