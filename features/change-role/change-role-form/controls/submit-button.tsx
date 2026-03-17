import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const SubmitButton = () => {
  const role = useRole();
  const { mode } = useChangeRoleFormData(true);
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  // TODO: move this to somethere ?
  const clickHandle = useCallback(() => {
    setValue('isRevoke', false);
  }, [setValue]);

  const title =
    mode === 'managerReset'
      ? `Reset ${role} address`
      : mode === 'propose'
        ? `Propose a new ${role} address`
        : `Change ${role} address`;

  return (
    <>
      <SubmitButtonHookForm onClick={clickHandle}>{title}</SubmitButtonHookForm>
      {mode === 'propose' && (
        <Note>
          To complete the address change, the owner of the new address must
          confirm the change
        </Note>
      )}
    </>
  );
};
