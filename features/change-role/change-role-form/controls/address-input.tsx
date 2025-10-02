import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useRole } from '../hooks/use-role';
import { useChangeRoleFormData } from '../context';

export const AddressInput: React.FC = () => {
  const { isManagerReset } = useChangeRoleFormData();
  const role = useRole();

  return (
    <>
      <FormTitle>Specify a new {role} address</FormTitle>
      <AddressInputHookForm
        fieldName="address"
        label={<>New {role} address</>}
        isLocked={isManagerReset}
      />
    </>
  );
};
