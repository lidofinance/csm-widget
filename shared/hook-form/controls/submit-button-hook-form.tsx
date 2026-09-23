import { useFormContext, useFormState, useWatch } from 'react-hook-form';

import { ButtonIcon, Lock } from '@lidofinance/lido-ui';
import { useDappStatus } from 'modules/web3';
import { Connect } from 'shared/wallet';
import { hasErrors } from '../validation/validation-error';

type IntentFormInput = {
  intent?: string;
};

type SubmitButtonHookFormProps = Partial<
  React.ComponentProps<typeof ButtonIcon>
> & {
  isLocked?: boolean;
  noDisableOnError?: boolean;
  disableIfClean?: boolean;
  /** Form `intent` this button submits with; `undefined` is the primary submit. A truthy intent renders `type="button"` so it cannot win implicit Enter submission. */
  intent?: string;
};

export const SubmitButtonHookForm: React.FC<SubmitButtonHookFormProps> = ({
  isLocked,
  icon,
  disabled: disabledProp,
  intent,
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

  const { setValue } = useFormContext<IntentFormInput>();
  const formIntent = useWatch<IntentFormInput>({ name: 'intent' });
  const isBusy = isValidating || isSubmitting;

  if (!isAccountActive) return <Connect fullwidth />;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (formIntent !== intent) setValue('intent', intent);
    onClick?.(event);
    if (intent) event.currentTarget.form?.requestSubmit();
  };

  return (
    <ButtonIcon
      fullwidth
      loading={isBusy && formIntent === intent}
      disabled={disabled || (isBusy && formIntent !== intent)}
      icon={icon || isLocked ? <Lock /> : <></>}
      {...props}
      type={intent ? 'button' : 'submit'}
      onClick={handleClick}
    />
  );
};
