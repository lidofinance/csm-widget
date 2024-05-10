import { FC, memo } from 'react';

import { ClaimRewardsFormProvider } from './context';

import { ClaimRewardsFormInfo } from './claim-rewards-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { ClaimRewardsHat } from './hat';
import { ClaimRewardsBlock, FormControllerStyled } from './styles';

export const ClaimRewardsForm: FC = memo(() => {
  return (
    <ClaimRewardsFormProvider>
      <ClaimRewardsHat />
      <ClaimRewardsBlock>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimRewardsFormInfo />
      </ClaimRewardsBlock>
    </ClaimRewardsFormProvider>
  );
});
