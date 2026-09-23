import { useWatch } from 'react-hook-form';
import { FormTitle, Stack } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { isAddress, isAddressEqual } from 'viem';
import { useRole } from '../hooks/use-role';
import {
  ChangeRoleFormInputType,
  useChangeRoleFlow,
  useChangeRoleFormData,
} from '../context';
import { AddressGroupingNoteStyle } from './styles';

export const AddressInput: React.FC = () => {
  const flow = useChangeRoleFlow();
  const { address, currentAddress, otherRoleAddress } =
    useChangeRoleFormData(true);
  const role = useRole();

  const newAddress = useWatch<ChangeRoleFormInputType, 'address'>({
    name: 'address',
  });

  const showGroupingNote =
    !!newAddress &&
    isAddress(newAddress) &&
    !isAddressEqual(newAddress, address) &&
    isAddressEqual(currentAddress, address) &&
    !isAddressEqual(otherRoleAddress, address);

  return (
    <>
      <FormTitle>Specify a new {role} Address</FormTitle>
      <Stack direction="column" gap="sm">
        <AddressInputHookForm
          fieldName="address"
          label={`New ${role} Address`}
          isLocked={flow.action === 'manager-reset'}
          currentAddress={
            isAddressEqual(currentAddress, address) ? undefined : address
          }
        />
        {showGroupingNote && (
          <AddressGroupingNoteStyle data-testid="addressGroupingNote">
            Operators are grouped by their associated address. Changing it will
            affect the operators shown in the interface.
          </AddressGroupingNoteStyle>
        )}
      </Stack>
    </>
  );
};
