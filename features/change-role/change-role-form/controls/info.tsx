import { ROLES } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { ROLES_METADATA } from 'consts/roles';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  IconTooltip,
  Latice,
  RoleActionsList,
  Stack,
  TitledAddress,
  Warning,
} from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { isAddressEqual } from 'viem';
import {
  type ChangeRoleFormInputType,
  useChangeRoleFlow,
  useChangeRoleFormData,
} from '../context';
import { useRole } from '../hooks/use-role';
import { MODULE_METADATA } from 'consts';
import { config } from 'config';

export const Info: FC = () => {
  const roleTitle = useRole();
  const flow = useChangeRoleFlow();
  const {
    currentAddress,
    proposedAddress,
    address,
    extendedManagerPermissions,
    role,
    invite,
  } = useChangeRoleFormData(true);
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const revokeHandle = useCallback(() => {
    setValue('intent', 'revoke');
  }, [setValue]);

  const acceptHandle = useCallback(() => {
    setValue('intent', 'accept');
  }, [setValue]);

  return (
    <>
      <Text size="md" weight={700} as="h4">
        {ROLES_METADATA[role].capitalizedTitle} Address
      </Text>
      <Latice variant="secondary">
        <TitledAddress
          title={
            <Stack center gap="xs">
              Current {roleTitle} Address
              <IconTooltip
                tooltip={
                  <RoleActionsList
                    role={role}
                    extendedManagerPermissions={extendedManagerPermissions}
                  />
                }
              />
            </Stack>
          }
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
                  {flow.action === 'propose' ? (
                    <SubmitButtonHookForm
                      variant="outlined"
                      size="xs"
                      fullwidth={false}
                      onClick={revokeHandle}
                      noDisableOnError
                    >
                      Cancel
                    </SubmitButtonHookForm>
                  ) : (
                    invite && (
                      <SubmitButtonHookForm
                        variant="outlined"
                        size="xs"
                        fullwidth={false}
                        onClick={acceptHandle}
                        noDisableOnError
                      >
                        Accept
                      </SubmitButtonHookForm>
                    )
                  )}
                </>
              }
              address={proposedAddress}
              isYou={isAddressEqual(proposedAddress, address)}
            />
            <Text size="xxs" weight={700}>
              Action required
            </Text>
            <Text as="div" size="xxs">
              <ol>
                <li>
                  Connect to {MODULE_METADATA[config.module].shortTitle} UI with
                  the proposed address
                </li>
                <li>
                  Go to Settings tab → Inbox requests to confirm the change
                </li>
              </ol>
            </Text>
          </Stack>
        )}
      </Latice>
    </>
  );
};
