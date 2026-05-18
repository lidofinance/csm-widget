import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimIdvtcFormLoader } from './claim-idvtc-form-loader';
import { ClaimIdvtcDataProvider, ClaimIdvtcFormProvider } from './context';
import { Info } from './controls/info';
import { ModeSelector } from './controls/mode-selector';
import { Parameters } from './controls/parameters';
import { SubmitButton } from './controls/submit-button';

export const ClaimIdvtcForm: FC = memo(() => {
  return (
    <ClaimIdvtcDataProvider>
      <ClaimIdvtcFormProvider>
        <FormBlock>
          <ClaimIdvtcFormLoader>
            <Form>
              <Info />
              <ModeSelector />
              <Parameters />
              <SubmitButton />
            </Form>
          </ClaimIdvtcFormLoader>
        </FormBlock>
      </ClaimIdvtcFormProvider>
    </ClaimIdvtcDataProvider>
  );
});
