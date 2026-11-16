import {
  Address,
  IconCheck,
  Identicon,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useEnsInput } from 'shared/hooks/use-ens-input';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { AddressSpinnerStyle, ConnectedAddressButtonStyle } from './styles';
import { TrailingInput } from './trailing-input';
import { useFieldController } from './use-field-controller';

export type AddressFieldProps = {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  tooltip?: ReactNode;
  currentAddress?: string;
  addressName?: string;
  disabled?: boolean;
  locked?: boolean;
  trailing?: ReactNode;
  simple?: boolean;
  /** Overrides the field's error: `true` highlights without a message, `false` hides it. */
  error?: boolean;
  showUntouched?: boolean;
};

export const AddressField: FC<AddressFieldProps> = ({
  name,
  label,
  placeholder = 'Ethereum address or ENS name',
  description,
  tooltip,
  currentAddress,
  addressName,
  disabled,
  locked = false,
  trailing,
  simple = false,
  error,
  showUntouched,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    defaultValue: '',
    showUntouched,
  });
  const { setValue } = useFormContext();
  const { inputValue, address, ensName, isEns, isLoading, onInputChange } =
    useEnsInput({ value: field.value, onChange: field.onChange });
  const isDisabled = disabled || field.disabled;

  const fillConnected = useCallback(
    () => setValue(name, currentAddress, { shouldValidate: true }),
    [currentAddress, name, setValue],
  );

  const icon = isLoading ? (
    <AddressSpinnerStyle decorative data-testid="loader" />
  ) : (
    !simple && address && <Identicon address={address} size={20} />
  );

  return (
    <TrailingInput
      ref={field.ref}
      name={field.name}
      value={inputValue}
      onChange={onInputChange}
      onBlur={field.onBlur}
      disabled={isDisabled}
      readOnly={locked}
      placeholder={placeholder}
      spellCheck={false}
      icon={trailing == null ? icon : undefined}
      trailing={trailing}
      tooltip={tooltip}
      description={description}
      error={isLoading ? undefined : (error ?? message ?? invalid)}
      dataTestId={{ error: FIELD_ERROR_TEST_ID }}
      label={
        label == null ? undefined : (
          <Stack as="span" inline direction="row" wrap align="center" gap={8}>
            {label}
            {!simple && isEns && address && (
              <Tag variant="neutral">
                <Address address={address} symbols={6} />
              </Tag>
            )}
            {!simple && !isEns && ensName && (
              <Tag variant="neutral">{ensName}</Tag>
            )}
            {addressName && (
              <Tag
                variant="success"
                icon={<IconCheck />}
                data-testid="verifiedChip"
              >
                {addressName}
              </Tag>
            )}
            {currentAddress && !locked && (
              <ConnectedAddressButtonStyle
                type="button"
                onClick={fillConnected}
                disabled={isDisabled}
              >
                Connected address
              </ConnectedAddressButtonStyle>
            )}
          </Stack>
        )
      }
    />
  );
};
