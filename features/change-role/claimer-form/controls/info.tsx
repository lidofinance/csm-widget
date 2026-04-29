import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  IconTooltip,
  Latice,
  Stack,
  TitledAddress,
  TitledValue,
} from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimerFormInputType, useClaimerFormData } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const { currentClaimerAddress, canEdit } = useClaimerFormData(true);
  const { setValue } = useFormContext<ClaimerFormInputType>();

  const unsetHandle = useCallback(() => {
    setValue('isUnset', true);
  }, [setValue]);

  const title = (
    <Stack center gap="xs">
      Current Rewards claimer
      <IconTooltip tooltip="Is an optional address authorized to trigger reward claims on your behalf. Unlike the Rewards Address, it does not receive the funds. It only initiates the claim transaction." />
    </Stack>
  );

  return (
    <>
      <Text size="md" weight={700} as="h4">
        Rewards claimer
      </Text>
      <Latice variant="secondary">
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
                    onClick={unsetHandle}
                    noDisableOnError
                  >
                    Unset
                  </SubmitButtonHookForm>
                )}
              </>
            }
            address={currentClaimerAddress}
          />
        ) : (
          <TitledValue title={title} value="not set" />
        )}
      </Latice>
    </>
  );
};
