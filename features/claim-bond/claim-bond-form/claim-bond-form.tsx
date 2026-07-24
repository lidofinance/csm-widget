import { FC, memo } from 'react';

import { ClaimBondDataProvider, ClaimBondFormProvider } from './context';

import { FormBlock, Stack } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { ClaimBondFormLoader } from './claim-bond-form-loader';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SourcesInfo } from './controls/sources-info';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondDataProvider>
      <ClaimBondFormProvider>
        <Stack direction="column" gap="ms">
          <SourcesInfo />
          <FormBlock data-testid="claimBondForm">
            <ClaimBondFormLoader>
              <Form>
                <SourceSelect />
                <TokenSelect />
                <AmountInput />
                <SubmitButton />
              </Form>
              <ClaimBondFormInfo />
            </ClaimBondFormLoader>
          </FormBlock>
        </Stack>
      </ClaimBondFormProvider>
    </ClaimBondDataProvider>
  );
});
