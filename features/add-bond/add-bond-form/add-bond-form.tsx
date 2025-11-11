import { FC, memo } from 'react';

import { AddBondDataProvider, AddBondFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { AddBondFormInfo } from './add-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const AddBondForm: FC = memo(() => {
  return (
    <AddBondDataProvider>
      <AddBondFormProvider>
        <FormBlock data-testid="addBondForm">
          <FormLoader>
            <Form>
              <Info />
              <TokenSelect />
              <AmountInput />
              <SubmitButton />
            </Form>
            <AddBondFormInfo />
          </FormLoader>
        </FormBlock>
      </AddBondFormProvider>
    </AddBondDataProvider>
  );
});
