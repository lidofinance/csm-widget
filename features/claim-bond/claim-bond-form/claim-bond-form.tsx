import { FC, memo } from 'react';

import { ClaimBondFormProvider } from './context';

import { FormBlock } from 'shared/components';
import {
  BaseFormLoader,
  FormControllerStyled,
} from 'shared/hook-form/form-controller';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondFormProvider>
      <FormBlock>
        <BaseFormLoader>
          <FormControllerStyled>
            <SourceSelect />
            <TokenSelect />
            <AmountInput />
            <SubmitButton />
          </FormControllerStyled>
          <ClaimBondFormInfo />
        </BaseFormLoader>
      </FormBlock>
    </ClaimBondFormProvider>
  );
});
