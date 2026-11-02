import { Address, Identicon, Input, Tag } from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useEnsInput } from 'shared/hooks/use-ens-input';
import { FIELD_ERROR_TEST_ID } from './field-error';
import {
  AddressLabelStyle,
  AddressSpinnerStyle,
  ConnectedAddressButtonStyle,
} from './styles';
import { useFieldController } from './use-field-controller';

export type AddressFieldProps = {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  tooltip?: ReactNode;
  currentAddress?: string;
  addressName?: string;
  disabled?: boolean;
  showUntouched?: boolean;
};

export const AddressField: FC<AddressFieldProps> = ({
  name,
  label,
  description,
  tooltip,
  currentAddress,
  addressName,
  disabled,
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
    <AddressSpinnerStyle data-testid="loader" />
  ) : (
    address && <Identicon address={address} size={20} />
  );

  return (
    <Input
      ref={field.ref}
      name={field.name}
      value={inputValue}
      onChange={onInputChange}
      onBlur={field.onBlur}
      disabled={isDisabled}
      placeholder="Ethereum address or ENS name"
      spellCheck={false}
      icon={icon}
      tooltip={tooltip}
      description={description}
      error={isLoading ? undefined : (message ?? invalid)}
      dataTestId={{ error: FIELD_ERROR_TEST_ID }}
      label={
        <AddressLabelStyle>
          {label}
          {isEns && address && (
            <Tag variant="neutral">
              <Address address={address} symbols={6} />
            </Tag>
          )}
          {!isEns && ensName && <Tag variant="neutral">{ensName}</Tag>}
          {addressName && (
            <Tag variant="success" data-testid="verifiedChip">
              {addressName}
            </Tag>
          )}
          {currentAddress && (
            <ConnectedAddressButtonStyle
              type="button"
              onClick={fillConnected}
              disabled={isDisabled}
            >
              Connected address
            </ConnectedAddressButtonStyle>
          )}
        </AddressLabelStyle>
      }
    />
  );
};
