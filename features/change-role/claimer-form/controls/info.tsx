import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, TitledAddress } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimerFormInputType, useClaimerFormData } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const { currentClaimerAddress } = useClaimerFormData(true);
  const { setValue } = useFormContext<ClaimerFormInputType>();

  const unsetHandle = useCallback(() => {
    setValue('isUnset', true);
  }, [setValue]);

  return (
    <>
      <Text size="md" weight={700} as="h4">
        Rewards claimer
      </Text>
      {currentClaimerAddress && (
        <Latice variant="secondary">
          <TitledAddress
            title={
              <>
                Current Rewards claimer
                <SubmitButtonHookForm
                  variant="outlined"
                  size="xs"
                  fullwidth={false}
                  onClick={unsetHandle}
                >
                  Unset
                </SubmitButtonHookForm>
              </>
            }
            address={currentClaimerAddress}
          />
        </Latice>
      )}
    </>
  );
};
