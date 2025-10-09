import { FC, memo } from 'react';

import { CleanQueueFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { CleanQueueFormLoader } from './clean-queue-form-loader';

export const CleanQueueForm: FC = memo(() => {
  return (
    <CleanQueueFormProvider>
      <FormBlock>
        <CleanQueueFormLoader>
          <FormControllerStyled>
            <Info />
            <SubmitButton />
          </FormControllerStyled>
        </CleanQueueFormLoader>
      </FormBlock>
    </CleanQueueFormProvider>
  );
});
