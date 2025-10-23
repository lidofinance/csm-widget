import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, Stack, TitledAddress, Warning } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';
import { Text } from '@lidofinance/lido-ui';

export const Info: FC = () => {
  const role = useRole();
  const { currentAddress, proposedAddress, isPropose } =
    useChangeRoleFormData(true);
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const revokeHandle = useCallback(() => {
    setValue('isRevoke', true);
  }, [setValue]);

  return (
    <>
      <Latice variant="secondary">
        <TitledAddress
          title={`Current ${role} address`}
          address={currentAddress}
        />

        {proposedAddress && (
          <Stack direction="column" gap="sm" data-testid="proposedAddress">
            <TitledAddress
              title={
                <>
                  <Warning text="Pending change" />
                  {isPropose && (
                    <SubmitButtonHookForm
                      variant="outlined"
                      size="xs"
                      fullwidth={false}
                      onClick={revokeHandle}
                    >
                      Revoke
                    </SubmitButtonHookForm>
                  )}
                </>
              }
              address={proposedAddress}
            />
            <Text size="xxs" weight={700}>
              Action required
            </Text>
            <Text as="div" size="xxs">
              <ol>
                <li>Connect to CSM UI with the proposed address</li>
                <li>Go to Roles tab → Inbox requests to confirm the change</li>
              </ol>
            </Text>
          </Stack>
        )}
      </Latice>
    </>
  );
};
