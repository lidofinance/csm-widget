import { FC, memo } from 'react';
import { useWatch } from 'react-hook-form';

import {
  ClaimBondDataProvider,
  ClaimBondFormProvider,
  ClaimBondFormInputType,
  useClaimBondFormData,
  optionShowsTokenAmount,
} from './context';

import { FormBlock, Stack } from 'shared/components';
import { FormLoader, Form } from 'shared/hook-form/form-controller';
import { ClaimBondFormInfo } from './claim-bond-form-info';
import { AmountInput } from './controls/amount-input';
import { SourceSelect } from './controls/source-select';
import { SubmitButton } from './controls/submit-button';
import { TokenSelect } from './controls/token-select';
import { SourcesInfo } from './controls/sources-info';
import { EmptyState } from './controls/empty-state';

const ClaimBondFormBody: FC = () => {
  const { bond, rewards } = useClaimBondFormData(true);
  const [claimOption] = useWatch<ClaimBondFormInputType, ['claimOption']>({
    name: ['claimOption'],
  });

  const isNothingToClaim =
    rewards.available === 0n && !bond.isInsufficient && bond.delta === 0n;

  if (isNothingToClaim) {
    return <EmptyState />;
  }

  const showTokenAmount = optionShowsTokenAmount(claimOption);

  return (
    <>
      <Form>
        <SourceSelect />
        {showTokenAmount && <TokenSelect />}
        {showTokenAmount && <AmountInput />}
        <SubmitButton />
      </Form>
      {showTokenAmount && <ClaimBondFormInfo />}
    </>
  );
};

export const ClaimBondForm: FC = memo(() => {
  return (
    <ClaimBondDataProvider>
      <ClaimBondFormProvider>
        <Stack direction="column" gap="ms">
          <SourcesInfo />
          <FormBlock data-testid="claimBondForm">
            <FormLoader>
              <ClaimBondFormBody />
            </FormLoader>
          </FormBlock>
        </Stack>
      </ClaimBondFormProvider>
    </ClaimBondDataProvider>
  );
});
