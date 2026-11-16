import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitButton } from 'shared/form-page';
import { SubmitKeysFormInputType } from '../context';

export const CreateSubmitButton: FC = () => {
  const depositData = useWatch<SubmitKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });

  return (
    <SubmitButton
      disabled={!depositData?.length}
      data-testid="submitKeysButton"
    >
      Submit
    </SubmitButton>
  );
};
