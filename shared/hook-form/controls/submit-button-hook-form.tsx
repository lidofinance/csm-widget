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
};

export const SubmitButtonHookForm: React.FC<SubmitButtonHookFormProps> = ({
  isLocked,
  icon,
  disabled: disabledProp,
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
