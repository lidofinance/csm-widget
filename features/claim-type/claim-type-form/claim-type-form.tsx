import { FC, memo } from 'react';

import { ClaimTypeFormProvider } from './context';

import { ClaimTypeFormInfo } from './claim-type-form-info';
import { SubmitButton } from './controls/submit-button';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';
import { ClaimTypeFormLoader } from './claim-type-form-loader';

export const ClaimTypeForm: FC = memo(() => {
  return (
    <ClaimTypeFormProvider>
      <FormBlock>
        <ClaimTypeFormLoader>
          <FormControllerStyled>
            <Info />
            <SubmitButton />
          </FormControllerStyled>
          <ClaimTypeFormInfo />
        </ClaimTypeFormLoader>
      </FormBlock>
    </ClaimTypeFormProvider>
  );
});
