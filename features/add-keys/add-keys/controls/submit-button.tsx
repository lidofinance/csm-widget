import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitButton } from 'shared/form-page';
import { KEYS_LIMIT_REASON } from '../add-keys-state';
import { AddKeysFormInputType } from '../context';
import { useKeysLimit } from './keys-limit-warning';

export const KeysSubmitButton: FC = () => {
  const depositData = useWatch<AddKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });
  const keysLimit = useKeysLimit();

  return (
    <SubmitButton
      disableIfClean
      disabled={!depositData?.length}
      disabledReason={keysLimit?.reached ? KEYS_LIMIT_REASON : undefined}
      data-testid="submitKeysButton"
    >
      Submit
    </SubmitButton>
  );
};
