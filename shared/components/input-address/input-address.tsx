import { Address, Identicon, Loader } from '@lidofinance/lido-ui';
import { ChangeEvent, forwardRef, useCallback, useEffect, useRef } from 'react';
import { useEnsResolution } from 'shared/hooks/use-ens-resolution';
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
      ...props
    },
    ref,
  ) => {
    const { inputValue, address, ensName, isEns, isLoading, handleChange } =
      useEnsResolution();

    // Track what we emitted to parent to distinguish echoes from external changes
    const initializedRef = useRef(false);
    const emittedRef = useRef('');

    // Notify parent when resolved address changes (skip initial mount)
    useEffect(() => {
      const emitValue = address ?? '';
      emittedRef.current = emitValue;
      if (!initializedRef.current) {
        initializedRef.current = true;
        return;
      }
      onChange?.(emitValue);
    }, [address, onChange]);

    // Sync from parent value prop (programmatic fills only)
    useEffect(() => {
      if (value === emittedRef.current) return;
      if (value !== undefined && value !== inputValue) {
        handleChange(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const onInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        handleChange(e.currentTarget.value);
      },
      [handleChange],
    );

    return (
      <StyledInput
        {...props}
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
                <Loader size="small" />
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
      />
    );
  },
);
