import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls/address-input-hook-form';
import { useRole } from '../hooks/use-role';

export const AddressInput: React.FC = () => {
  const role = useRole();

  return (
    <>
      <FormTitle>Insert a new {role} address</FormTitle>
      <AddressInputHookForm fieldName="address" label={`New ${role} address`} />
    </>
  );
};
