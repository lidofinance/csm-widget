import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ClaimerFormInputType } from '../context';

export const SubmitButton: FC = () => {
  const { setValue } = useFormContext<ClaimerFormInputType>();

  const clickHandle = useCallback(() => {
    setValue('isUnset', false);
  }, [setValue]);

  return (
    <>
      <SubmitButtonHookForm disableIfClean onClick={clickHandle}>
        Set new Rewards Claimer Address
      </SubmitButtonHookForm>
    </>
  );
};
