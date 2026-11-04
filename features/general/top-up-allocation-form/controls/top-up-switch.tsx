import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { SwitchField } from 'shared/hook-form/fields';
import { getTopUpCopy } from '../top-up-state';

// Rendered only in the `disable` flow, which exists only while top-ups are enabled
export const TopUpSwitch: FC = () => {
  const { isSubmitting } = useFormState();

  return (
    <SwitchField
      name="enabled"
      label={getTopUpCopy(true).status}
      submitOnChange
      disabled={isSubmitting}
    />
  );
};
