import { FC, memo } from 'react';

import { ClaimRewardsFormProvider } from './context';

import { ClaimRewardsFormInfo } from './claim-rewards-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { ClaimRewardsHat } from './hat';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const ClaimRewardsForm: FC = memo(() => {
  return (
    <ClaimRewardsFormProvider>
      <ClaimRewardsHat />
      <FormBlock>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimRewardsFormInfo />
      </FormBlock>
    </ClaimRewardsFormProvider>
  );
});
