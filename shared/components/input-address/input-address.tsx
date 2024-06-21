import { AddressZero } from '@ethersproject/constants';
import { Identicon, Input, Loader } from '@lidofinance/lido-ui';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { RevokeButton } from './revoke-button';
import { InputAddressProps } from './types';

export const InputAddress = forwardRef<HTMLInputElement, InputAddressProps>(
  (
    {
      isAddressResolving,
      address,
      revoke,
      onChange,
      value,
      showCopyBtn,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        onChange?.(currentValue);
      },
      [onChange],
    );

    const handleClickRevoke = onChange
      ? () => {
          onChange(AddressZero);
        }
      : undefined;

    return (
      <Input
        {...props}
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="Ethereum address"
        leftDecorator={
          isAddressResolving ? (
            <Loader size="small" />
          ) : address ? (
            <Identicon data-testid="addressIcon" address={address} />
          ) : value && !props.error ? (
            <Identicon data-testid="addressIcon" address={value} />
          ) : null
        }
        rightDecorator={
          revoke ? <RevokeButton onClick={handleClickRevoke} /> : null
        }
        spellCheck="false"
        // error={inputValue.length > 0 && !isValidAnyAddress(inputValue)}
      />
    );
  },
);
