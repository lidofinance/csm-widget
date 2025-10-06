import { Textarea } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { TextareaStyle } from './styles';

type DepositKeysInputHookFormProps = Partial<
  React.ComponentProps<typeof Textarea>
> & {
  label?: string;
  fieldName?: string;
};

export const DepositDataInput: FC<DepositKeysInputHookFormProps> = ({
  label = 'Paste JSON with deposit data or drag and drop the file',
  fieldName = 'rawDepositData',
  ...props
}) => {
  const { field } = useController<Record<string, string>>({ name: fieldName });

  return (
    <TextareaStyle
      {...props}
      {...field}
      disabled={props.disabled || field.disabled}
      label={label}
      rows={6}
      fullwidth
    />
  );
};
