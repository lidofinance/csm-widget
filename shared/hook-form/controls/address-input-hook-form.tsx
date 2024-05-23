import { useController } from 'react-hook-form';
import { InputAddress } from 'shared/components/input-address';
import { isValidAddress } from 'shared/components/input-address/address-validation';

type AddressInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAddress>
> & {
  fieldName: string;
  label?: string;
  revoke?: boolean;
};

export const AddressInputHookForm = ({
  fieldName,
  label,
  revoke,
  ...props
}: AddressInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    rules: {
      validate: isValidAddress,
    },
  });

  return (
    <InputAddress
      {...props}
      {...field}
      error={!!error}
      disabled={props.disabled ?? field.disabled}
      label={label ?? fieldName}
      showCopyBtn={false}
      address={''}
      isAddressResolving={false}
      revoke={revoke}
      fullwidth
    />
  );
};
