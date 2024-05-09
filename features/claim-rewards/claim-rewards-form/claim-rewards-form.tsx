import { FC, memo } from 'react';

import { ClaimRewardsFormProvider } from './context';

import { SubmitButton } from './controls/submit-button';
import { ClaimRewardsFormInfo } from './claim-rewards-form-info';
import { FormControllerStyled } from './styles';
import { AmountInput } from './controls/amount-input';
import { Block } from '@lidofinance/lido-ui';
import { ClaimRewardsHat } from './hat';

export const ClaimRewardsForm: FC = memo(() => {
  return (
    <ClaimRewardsFormProvider>
      <ClaimRewardsHat />
      <Block>
        <FormControllerStyled>
          <AmountInput />
          <SubmitButton />
        </FormControllerStyled>
        <ClaimRewardsFormInfo />
      </Block>
    </ClaimRewardsFormProvider>
  );
});
