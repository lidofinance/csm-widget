import { FC, useRef } from 'react';
import { useController } from 'react-hook-form';
import { Toggle, ToggleProps } from 'shared/components';

type ToggleHookFormProps = Omit<ToggleProps, 'checked' | 'onChange'> & {
  fieldName: string;
  submitOnChange?: boolean;
};

export const ToggleHookForm: FC<ToggleHookFormProps> = ({
  fieldName,
  submitOnChange,
  ...rest
}) => {
  const { field } = useController({ name: fieldName });
  const ref = useRef<HTMLButtonElement>(null);

  const handleChange = (value: boolean) => {
    field.onChange(value);
    if (submitOnChange) ref.current?.form?.requestSubmit();
  };

  return (
    <Toggle
      {...rest}
      ref={ref}
      checked={!!field.value}
      onChange={handleChange}
    />
  );
};
