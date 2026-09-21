import { FC } from 'react';
import {
  IconTooltip,
  Latice,
  Stack,
  TitledAddress,
  TitledValue,
} from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useClaimerFormData } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const { currentClaimerAddress, canEdit } = useClaimerFormData(true);

  const title = (
    <Stack center gap="xs">
      Current Rewards claimer
      <IconTooltip tooltip="Is an optional address authorized to trigger reward claims on your behalf. Unlike the Rewards Address, it does not receive the funds. It only initiates the claim transaction." />
    </Stack>
  );

  return (
    <>
      <Text size="md" weight={700} as="h4" data-testid="claimerSectionTitle">
        Rewards claimer
      </Text>
      <Latice variant="secondary" data-testid="currentClaimerInfo">
        {currentClaimerAddress ? (
          <TitledAddress
            title={
              <>
                {title}
                {canEdit && (
                  <SubmitButtonHookForm
                    variant="outlined"
                    size="xs"
                    fullwidth={false}
                    noDisableOnError
                    intent="unset"
                    data-testid="unsetClaimerButton"
                  >
                    Unset
                  </SubmitButtonHookForm>
                )}
              </>
            }
            address={currentClaimerAddress}
          />
        ) : (
          <TitledValue title={title} value="Not set" />
        )}
      </Latice>
    </>
  );
};
