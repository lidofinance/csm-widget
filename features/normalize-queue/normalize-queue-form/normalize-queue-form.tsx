import { FC, memo } from 'react';

import { NormalizeQueueFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { NormalizeQueueFormInfo } from './normalize-queue-form-info';
import { NormalizeQueueFormLoader } from './normalize-queue-form-loader';

export const NormalizeQueueForm: FC = memo(() => {
  return (
    <NormalizeQueueFormProvider>
      <FormBlock>
        <NormalizeQueueFormLoader>
          <FormControllerStyled>
            <Info />
            <SubmitButton />
          </FormControllerStyled>
          <NormalizeQueueFormInfo />
        </NormalizeQueueFormLoader>
      </FormBlock>
    </NormalizeQueueFormProvider>
  );
});
