import { MessageBox, Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { RoleActionsList } from 'shared/components';
import { FormCard, SubmitButton } from 'shared/form-page';
import { AddressField } from 'shared/hook-form/fields';
import { isAddressEqual } from 'viem';
import {
  getChangeRoleSubmitLabel,
  shouldShowGroupingNote,
} from '../change-role-state';
import {
  ChangeRoleFormInputType,
  useChangeRoleFlow,
  useChangeRoleFormData,
} from '../context';
import { useRole } from '../hooks/use-role';

export const AddressFormCard: FC = () => {
  const flow = useChangeRoleFlow();
  const roleTitle = useRole();
  const {
    address,
    currentAddress,
    otherRoleAddress,
    role,
    extendedManagerPermissions,
  } = useChangeRoleFormData(true);
  const newAddress = useWatch<ChangeRoleFormInputType, 'address'>({
    name: 'address',
  });

  const isReset = flow.action === 'manager-reset';

  return (
    <FormCard
      title={`Specify a new ${roleTitle} Address`}
      tooltip={
        <RoleActionsList
          role={role}
          extendedManagerPermissions={extendedManagerPermissions}
        />
      }
      description={
        flow.action === 'propose' ? (
          <span data-testid="noteText">
            To complete the address change, the owner of the new address must
            confirm the change
          </span>
        ) : undefined
      }
    >
      <AddressField
        name="address"
        label={`New ${roleTitle} Address`}
        locked={isReset}
        trailing={
          isReset ? <Tag variant="success">Connected wallet</Tag> : undefined
        }
        currentAddress={
          isAddressEqual(currentAddress, address) ? undefined : address
        }
      />
      {shouldShowGroupingNote({
        newAddress,
        address,
        currentAddress,
        otherRoleAddress,
      }) && (
        <MessageBox dataTestId={{ root: 'addressGroupingNote' }}>
          Operators are grouped by their associated address. Changing it will
          affect the operators shown in the interface.
        </MessageBox>
      )}
      <SubmitButton disableIfClean={!isReset}>
        {getChangeRoleSubmitLabel(flow.action, roleTitle)}
      </SubmitButton>
    </FormCard>
  );
};
