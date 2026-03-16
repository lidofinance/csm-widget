import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, TitledAddress, TitledValue } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimerFormInputType, useClaimerFormData } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const { currentClaimerAddress, isOwner } = useClaimerFormData(true);
  const { setValue } = useFormContext<ClaimerFormInputType>();

  const unsetHandle = useCallback(() => {
    setValue('isUnset', true);
  }, [setValue]);

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
                Current Rewards claimer
                {isOwner && (
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
          <TitledValue title="Current Rewards claimer" value="not set" />
        )}
      </Latice>
    </>
  );
};
