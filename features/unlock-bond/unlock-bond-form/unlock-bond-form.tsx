import { FC, memo } from 'react';

import { UnlockBondFormProvider } from './context';

import { UnlockBondFormInfo } from './unlock-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';
import { UnlockBondFormLoader } from './unlock-bond-form-loader';

export const UnlockBondForm: FC = memo(() => {
  return (
    <UnlockBondFormProvider>
      <FormBlock>
        <UnlockBondFormLoader>
          <FormControllerStyled>
            <Info />
            <AmountInput />
            <SubmitButton />
          </FormControllerStyled>
          <UnlockBondFormInfo />
        </UnlockBondFormLoader>
      </FormBlock>
    </UnlockBondFormProvider>
  );
});
