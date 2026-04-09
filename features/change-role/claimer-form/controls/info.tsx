import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, TitledAddress, TitledValue } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimerFormInputType, useClaimerFormData } from '../context';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const { currentClaimerAddress, canEdit } = useClaimerFormData(true);
  const { setValue } = useFormContext<ClaimerFormInputType>();

  const unsetHandle = useCallback(() => {
    setValue('isUnset', true);
  }, [setValue]);

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
                Current Rewards claimer
                {canEdit && (
                  <SubmitButtonHookForm
                    variant="outlined"
                    size="xs"
                    fullwidth={false}
                    onClick={unsetHandle}
                    noDisableOnError
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
          <TitledValue title="Current Rewards claimer" value="not set" />
        )}
      </Latice>
    </>
  );
};
