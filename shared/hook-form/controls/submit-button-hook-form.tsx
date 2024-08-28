import { useFormState } from 'react-hook-form';

import { ButtonIcon, Lock } from '@lidofinance/lido-ui';
import { useAccount } from 'shared/hooks';
import { Connect } from 'shared/wallet';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

type SubmitButtonHookFormProps = Partial<
  React.ComponentProps<typeof ButtonIcon>
> & {
  errorField?: string;
  isLocked?: boolean;
};

export const SubmitButtonHookForm: React.FC<SubmitButtonHookFormProps> = ({
  isLocked,
  errorField,
  icon,
  disabled: disabledProp,
  ...props
}) => {
  const { active } = useAccount();
  const { isValidating, isSubmitting } = useFormState();
  const { errors } = useFormState<Record<string, unknown>>();
  const disabled =
    (errorField &&
      !!errors[errorField] &&
      isValidationErrorTypeValidate(errors[errorField]?.type)) ||
    disabledProp;

  if (!active) return <Connect fullwidth />;

  return (
    <ButtonIcon
      fullwidth
      type="submit"
      loading={isValidating || isSubmitting}
      disabled={disabled}
      icon={icon || isLocked ? <Lock /> : <></>}
      {...props}
    />
  );
};
