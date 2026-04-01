import { FC, memo } from 'react';

import { ClaimBondDataProvider, ClaimBondFormProvider } from './context';

import { FormBlock, Stack } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SourcesInfo } from './controls/sources-info';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondDataProvider>
      <ClaimBondFormProvider>
        <Stack direction="column" gap="ms">
          <SourcesInfo />
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
        </Stack>
      </ClaimBondFormProvider>
    </ClaimBondDataProvider>
  );
});
