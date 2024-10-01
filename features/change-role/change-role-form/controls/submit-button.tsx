import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const SubmitButton = () => {
  const role = useRole();
  const { isPropose } = useChangeRoleFormData();
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const clickHandle = useCallback(() => {
    setValue('isRevoke', false);
  }, [setValue]);

  return (
    <>
      <SubmitButtonHookForm errorField="address" onClick={clickHandle}>
        {isPropose ? 'Propose a new' : 'Change'} {role} address
      </SubmitButtonHookForm>
      {isPropose && (
        <Note>
          To complete the address change, the owner of the new address must
          confirm the change
        </Note>
      )}
    </>
  );
};
