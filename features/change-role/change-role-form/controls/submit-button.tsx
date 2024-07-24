import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType } from '../context';
import { useRole } from '../hooks/use-role';

export const SubmitButton = () => {
  const role = useRole();
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const clickHandle = useCallback(() => {
    setValue('isRevoke', false);
  }, [setValue]);

  return (
    <>
      <SubmitButtonHookForm errorField="address" onClick={clickHandle}>
        Propose a new {role} address
      </SubmitButtonHookForm>
      <Note text="To complete the address change, the owner of the new address must confirm the change" />
    </>
  );
};
