import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { ROLES_METADATA } from 'consts/roles';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, Stack, TitledAddress, Warning } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { isAddressEqual } from 'viem';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const Info: FC = () => {
  const roleTitle = useRole();
  const {
    currentAddress,
    proposedAddress,
    isPropose,
    address,
    extendedManagerPermissions,
    role,
  } = useChangeRoleFormData(true);
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const revokeHandle = useCallback(() => {
    setValue('isRevoke', true);
  }, [setValue]);

  return (
    <>
      <Text size="md" weight={700} as="h4">
        {ROLES_METADATA[role].capitalizedTitle} Address
      </Text>
      <Latice variant="secondary">
        <TitledAddress
          title={`Current ${roleTitle} address`}
          address={currentAddress}
          isYou={isAddressEqual(currentAddress, address)}
          isOwner={
            extendedManagerPermissions
              ? role === ROLES.MANAGER
              : role === ROLES.REWARDS
          }
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
                      noDisableOnError
                    >
                      Cancel
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
