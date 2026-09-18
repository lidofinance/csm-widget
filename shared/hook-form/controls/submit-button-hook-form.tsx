import { useFormState } from 'react-hook-form';

import { ButtonIcon, Lock } from '@lidofinance/lido-ui';
import { useDappStatus } from 'modules/web3';
import { Connect } from 'shared/wallet';
import { hasErrors } from '../validation/validation-error';

type SubmitButtonHookFormProps = Partial<
  React.ComponentProps<typeof ButtonIcon>
> & {
  isLocked?: boolean;
  noDisableOnError?: boolean;
  disableIfClean?: boolean;
  /** Submits on click instead of being a `type="submit"` button, so it cannot win the form's implicit submit over the primary action. */
  secondaryAction?: boolean;
};

export const SubmitButtonHookForm: React.FC<SubmitButtonHookFormProps> = ({
  isLocked,
  icon,
  disabled: disabledProp,
  secondaryAction,
  onClick,
  ...props
}) => {
  const { isAccountActive } = useDappStatus();
  const { isValidating, isSubmitting, isDirty } = useFormState();
  const { errors } = useFormState<Record<string, unknown>>();
  const disabled =
    (hasErrors(errors) && !props.noDisableOnError) ||
    (props.disableIfClean && !isDirty) ||
    disabledProp;

  if (!isAccountActive) return <Connect fullwidth />;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (secondaryAction) event.currentTarget.form?.requestSubmit();
  };

  return (
    <ButtonIcon
      fullwidth
      loading={isValidating || isSubmitting}
      disabled={disabled}
      icon={icon || isLocked ? <Lock /> : <></>}
      {...props}
      type={secondaryAction ? 'button' : 'submit'}
      onClick={handleClick}
    />
  );
};
