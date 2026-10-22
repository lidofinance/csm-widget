import { FC } from 'react';
import { useController } from 'react-hook-form';
import { Toggle, ToggleProps } from 'shared/components';

type ToggleHookFormProps = Omit<ToggleProps, 'checked' | 'onChange'> & {
  fieldName: string;
};

export const ToggleHookForm: FC<ToggleHookFormProps> = ({
  fieldName,
  ...rest
}) => {
  const { field } = useController({ name: fieldName });

  return <Toggle {...rest} checked={!!field.value} onChange={field.onChange} />;
};
