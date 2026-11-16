import { Switch, SwitchProps } from '@lidofinance/lido-app-ui';
import { ChangeEvent, FC } from 'react';
import { useFieldController } from './use-field-controller';

export type SwitchFieldProps = Omit<
  SwitchProps,
  'name' | 'checked' | 'defaultChecked' | 'value' | 'onChange' | 'onBlur'
> & {
  name: string;
  /** Submits the owning form right after the value flips. */
  submitOnChange?: boolean;
};

export const SwitchField: FC<SwitchFieldProps> = ({
  name,
  submitOnChange = false,
  disabled,
  ...rest
}) => {
  const { field } = useFieldController({ name });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(event.target.checked);
    if (submitOnChange) event.currentTarget.form?.requestSubmit();
  };

  return (
    <Switch
      {...rest}
      ref={field.ref}
      name={field.name}
      checked={!!field.value}
      onChange={handleChange}
      onBlur={field.onBlur}
      disabled={disabled || field.disabled}
    />
  );
};
