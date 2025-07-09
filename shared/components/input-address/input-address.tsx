import { Address, Identicon, Loader } from '@lidofinance/lido-ui';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useAddressResolution } from 'shared/hooks';
import { InputDecoratorLocked } from '../input-amount/input-decorator-locked';
import { AddressChip, StyledInput } from './styles';
import { InputAddressProps } from './types';
import { VerifiedChip } from './verified-chip';

export const InputAddress = forwardRef<
  HTMLInputElement,
  InputAddressProps & { addressName?: string }
>(
  (
    { onChange, value, isLocked, rightDecorator, label, addressName, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);
    const { address, isLoading, resolveAddress } = useAddressResolution();

    useEffect(() => {
      if (address.value !== undefined) onChange?.(address.value);
    }, [address, onChange]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        void resolveAddress(currentValue);
      },
      [resolveAddress],
    );

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.value = value ?? '';
      }
      void resolveAddress(value ?? '');
    }, [resolveAddress, value]);

    return (
      <StyledInput
        {...props}
        label={
          <>
            {label}
            {address.ens && address.value && (
              <AddressChip>
                <Address address={address.value} symbols={32} />
              </AddressChip>
            )}
            {addressName && <VerifiedChip>{addressName}</VerifiedChip>}
          </>
        }
        ref={inputRef}
        defaultValue={value}
        onChange={handleChange}
        placeholder="Ethereum address"
        leftDecorator={
          isLoading ? (
            <Loader size="small" />
          ) : address.value ? (
            <Identicon address={address.value} />
          ) : null
        }
        rightDecorator={
          rightDecorator ?? (
            <>
              {isLocked ? (
                <InputDecoratorLocked title="Allows reset to the current address only" />
              ) : undefined}
            </>
          )
        }
        disabled={props.disabled || isLocked}
        spellCheck="false"
      />
    );
  },
);
