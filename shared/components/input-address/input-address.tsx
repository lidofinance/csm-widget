import { Address, Identicon, Loader } from '@lidofinance/lido-ui';
import { forwardRef } from 'react';
import { useEnsInput } from 'shared/hooks/use-ens-input';
import { InputDecoratorLocked } from '../input-amount/input-decorator-locked';
import { AddressChip, IdenticonSlot, StyledInput } from './styles';
import { InputAddressProps } from './types';
import { VerifiedChip } from './verified-chip';

export const InputAddress = forwardRef<
  HTMLInputElement,
  InputAddressProps & { addressName?: string; simple?: boolean }
>(
  (
    {
      onChange,
      value,
      isLocked,
      rightDecorator,
      label,
      addressName,
      simple,
      error,
      ...props
    },
    ref,
  ) => {
    const { inputValue, address, ensName, isEns, isLoading, onInputChange } =
      useEnsInput({ value, onChange });

    return (
      <StyledInput
        {...props}
        error={isLoading ? undefined : error}
        label={
          <>
            {label}
            {isEns && address && (
              <AddressChip>
                <Address address={address} symbols={32} />
              </AddressChip>
            )}
            {!isEns && ensName && <AddressChip>{ensName}</AddressChip>}
            {addressName && <VerifiedChip>{addressName}</VerifiedChip>}
          </>
        }
        ref={ref}
        value={inputValue}
        onChange={onInputChange}
        placeholder="Ethereum address or ENS name"
        leftDecorator={
          (!simple && (
            <IdenticonSlot>
              {isLoading ? (
                <Loader size="small" data-testid="loader" />
              ) : (
                address && <Identicon address={address} />
              )}
            </IdenticonSlot>
          )) ??
          null
        }
        rightDecorator={
          rightDecorator ??
          (isLocked ? (
            <InputDecoratorLocked title="Allows reset to the current address only" />
          ) : undefined)
        }
        disabled={props.disabled || isLocked}
        spellCheck="false"
        autoCapitalize="none"
        autoCorrect="off"
      />
    );
  },
);
