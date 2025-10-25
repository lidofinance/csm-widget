import { FC, memo } from 'react';

import { ClaimBondDataProvider, ClaimBondFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondDataProvider>
      <ClaimBondFormProvider>
        <FormBlock data-testid="claimBondForm">
          <FormLoader>
            <Form>
              <SourceSelect />
              <TokenSelect />
              <AmountInput />
              <SubmitButton />
            </Form>
            <ClaimBondFormInfo />
          </FormLoader>
        </FormBlock>
      </ClaimBondFormProvider>
    </ClaimBondDataProvider>
  );
});
