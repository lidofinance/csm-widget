import { FC, memo } from 'react';

import { ClaimBondFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { Block } from '@lidofinance/lido-ui';

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondFormProvider>
      <Block>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimBondFormInfo />
      </Block>
    </ClaimBondFormProvider>
  );
});
